# ktor-client

Библиотека работы с сетью. Основная документация доступна [на сайте](https://ktor.io/docs/client-create-and-configure.html).  
В проектах IceRock библиотека используется в паре с [moko-network](https://github.com/icerockdev/moko-network), которая генерирует из OpenAPI
спецификации весь сетевой код и сетевые сущности (с сериализацией через [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)).

В версиях ktor до 2.0 на iOS библиотека требовала использования native-mt версии корутин
(внутри ktor реализована полноценная многопоточность с обработкой всего pipeline на фоновом потоке).
С переходом Kotlin на новый memory model (по умолчанию с Kotlin 1.7.20) необходимость в
native-mt версиях корутин отпала.

В версиях ktor до 2.0 все блоки настроек plugins замораживались на iOS, поэтому требовалось подходить
к инициализации HttpClient'а аккуратно — не подавать в лямбды настроек ничего, что нельзя заморозить
(например `this` объекта). С новым Kotlin Native memory model (по умолчанию с Kotlin 1.7.20)
заморозка объектов больше не требуется.

## Получение HttpResponse

При выполнении запроса мы можем указать тип ответа, который мы хотим получить. И ktor-client
автоматически постарается [привести полученный от сервера ответ в нужный нам тип](https://ktor.io/docs/client-responses.html). За это отвечает `responsePipeline`, который обрабатывается при выполнении `body()` у
класса `HttpResponse`. На данном пайплайне находится и логика `ExceptionFeature`, и логика `ContentNegotiation`, и многие другие.

В случае если хочется выполнить запрос с полностью кастомной логикой обработки ответа, которая не будет проходить через `responsePipeline`, можно сделать так:

```kotlin
val response: HttpResponse = httpClient.get(requestUrl)

if (response.status.isSuccess()) {
    // success handle
} else {
    val statusCode: HttpStatusCode = response.status
    // read raw bytes without triggering responsePipeline
    val body: ByteArray = response.body()
}
```

В примере мы не вызываем `response.body<T>()` для типизированного ответа, чтобы не происходила
обработка `responsePipeline`. Вместо этого мы получаем raw-ответ через `response.body()`,
который возвращает чистые байты, пришедшие от сервера.

## Добавление логики в обработку каждого запроса/ответа

Для этого используются Ktor Plugins (в версиях до 2.0 назывались Features), которые позволяют поставить дополнительные блоки на pipeline.
Примеры использования стандартных плагинов можно посмотреть в статье [Kotlin Multiplatform Mobile: Intercepting Network Request and Response](https://yusufabd.medium.com/kotlin-multiplatform-mobile-intercepting-network-request-and-response-6805a79b4699)

## Отправка файлов
Для отправки файлов используются составные запросы со следующими типами содержимого:

### multipart/form-data 

[ссылка на wiki](https://ru.wikipedia.org/wiki/Multipart/form-data)

Данный тип является наиболее распространенным и позволяет отправлять сразу несколько файлов в запросе. Каждый из передаваемых файлов будет описан в теле запроса с основной информацией по нему. Пример *body* такого запроса:
```
POST /form.html HTTP/1.1
Host: server.com
Referer: http://server.com/form.html
User-Agent: Mozilla
Content-Type: multipart/form-data; boundary=-------------573cf973d5228
Content-Length: 288
Connection: keep-alive
Keep-Alive: 300
(пустая строка)
(отсутствующая преамбула)
---------------573cf973d5228
Content-Disposition: form-data; name="field"

text
---------------573cf973d5228
Content-Disposition: form-data; name="file"; filename="sample.txt"
Content-Type: text/plain

Content file
---------------573cf973d5228--
```
Как видно из *body*, у нас есть несколько параметров: `field` и `file`. Первый параметр представляет собой строковую константу, второй - файл.

При использовании данного подхода в ktor предусмотрен механизм создания `formData`. Здесь можно также разделить использование на несколько подходов:

### Передача файла как ByteArray

Данный подход хорошо описан в документации ktor ([ссылка на документацию](https://ktor.io/docs/client-requests.html#upload-file)).
Важной деталью в данной ссылке является добавление заголовка с файлом, который представлен в виде `byteArray`:

```kotlin
...
append("image", File("ktor_logo.png").readBytes(), Headers.build {
    append(HttpHeaders.ContentType, "image/png")
    append(HttpHeaders.ContentDisposition, "filename=ktor_logo.png")
})
...
```

Касаемо использования formData, существует несколько подходов в формировании *ktor* HTTP клиента:

### submitFormWithBinaryData

Для использования этого метода необходимо заранее сформировать `formData`. Код с таким методом выглядит следующим образом:
```kotlin
val response: HttpResponse = httpClient.submitFormWithBinaryData(url = requestUrl, formData = data)
```
Здесь `data` - сформированная *multipart formData*. В теле httpClient возможны настройки самого клиента, в том числе url, хедеры, тип метода (**важный поинт - multipart/form-data запросы должны быть только POST запросами!**)

### MultiPartFormDataContent

Здесь для ktor клиента в качестве *body* присваивается `MultiPartFormDataContent()`, параметром является список `PartData`, формируемый `formData`. Пример кода:
```kotlin
val response: HttpResponse = httpClient.post {
    ...
    setBody(MultiPartFormDataContent(parts = data))
}
```

### Пример реализации на Android

Стек: Retrofit 2.11.0, KotlinX.io, Multipart-formdata для передачи файла.
Для передачи файла в Retrofit надо представить его в формате понятном ему - RequestBody. Создаем наследника данного класса:

```kotlin
import kotlinx.io.Buffer
import kotlinx.io.readByteArray
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okio.BufferedSink
import io.example.FileSource
import kotlin.math.min

class FileSourceRequestBody(
    private val fileSource: FileSource,
    private val onUploadCallback: (Float) -> Unit,
) : RequestBody() {

	// Определяем тип контента для передачи в заголовке MediaType
    override fun contentType(): MediaType? {
        return when {
            fileSource.fileName.endsWith(".png", ignoreCase = true) -> "image/png"
            fileSource.fileName.endsWith(".jpg", ignoreCase = true) ||
                fileSource.fileName.endsWith(".jpeg", ignoreCase = true) -> "image/jpeg"
            fileSource.fileName.endsWith(".bmp", ignoreCase = true) -> "image/bmp"
            fileSource.fileName.endsWith(".gif", ignoreCase = true) -> "image/gif"
            fileSource.fileName.endsWith(".webp", ignoreCase = true) -> "image/webp"
            else -> "application/octet-stream"
        }.toMediaTypeOrNull()
    }

    override fun contentLength(): Long {
        return fileSource.fileSize
    }

    override fun writeTo(sink: BufferedSink) {
        // Создаем буфер
        val buffer = Buffer()
        // Объем загруженный на сервер, для расчета прогресса загрузки
        var totalBytesRead = 0L

        // Открываем поток, который будет закрыт автоматически по окончании работы с ним
        fileSource.source.use { source ->
            var readBytes: Long

            while (totalBytesRead != fileSource.fileSize) {
                // Читаем файл по размеру буффера, либо по оставшемуся количеству от файла для загрузки
                // Чтение происходит с удалением прочитанных байтов из source
                readBytes = source.readAtMostTo(
                    sink = buffer,
                    byteCount = min(
                        a = DEFAULT_BUFFER_SIZE,
                        b = fileSource.fileSize - totalBytesRead
                    )
                )

                totalBytesRead += readBytes

                // Записываем прочитанный объем в исходящий поток данных
                sink.write(
                    source = buffer.readByteArray(),
                    offset = 0,
                    byteCount = readBytes.toInt()
                )

                // Вычисляем прогресс загрузки
                calculateProgress(totalBytesRead, onUploadCallback)
            }

            // Очищаем текущий поток
            sink.flush()
        }
    }

    private fun calculateProgress(
        totalBytesRead: Long,
        onUploadCallback: (Float) -> Unit,
    ) {
        val progress: Float = (totalBytesRead / contentLength().toFloat())
        onUploadCallback(progress)
    }

    companion object {
        private const val DEFAULT_BUFFER_SIZE = 4096L
    }
}
```

В качестве входящих параметров для класса нужно передать информацию о файле, вторым параметром передаем callback для отображения прогресса загрузки на ui. Структура FileSource:

```kotlin
import kotlinx.io.RawSource

data class FileSource(
    val fileName: String,
    val source: RawSource,
    val fileSize: Long,
)
```
Теперь когда готовы основные структуры для загрузки файла на сервер, давайте создадим интерфейс для нашего API:

```kotlin
import okhttp3.MultipartBody
import retrofit2.Response
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface UploadApi {
    @Multipart
    @POST("/api/images")
    suspend fun uploadImage(
        @Part image: MultipartBody.Part,
    ): Response<SuccessDto>
}
```
Для обозначения, что в теле запроса содержится multi-part на него нужно повесить аннотацию '@Multipart', а для параметра содержащий его '@Part'. При вызове данного запроса в репозитории необходимо будет создать MultipartBody.Part, вызывом createFormData: 

```kotlin
...    
	suspend fun uploadImage(
        fileSource: FileSource,
        onUploadCallback: (Float) -> Unit,
    ): ImageUploadResult {
        return uploadApi.uploadImage(
                image = MultipartBody.Part.createFormData(
                    name = "image", // имя Multipart файла указанное в api бекенда
                    filename = fileSource.fileName, // Имя файла передается в заголовке form-data
                    body = FileSourceRequestBody(
                        fileSource = fileSource,
                        onUploadCallback = onUploadCallback
                    )
                )
            )
        }.toDomain()
    }
...
```

### application/octet-stream

Данный подход используется довольно редко, но все же используется. Для данного типа запроса нет возможности передать несколько параметров или файлов, можно отправлять файл, притом только один. Для реализации подхода необходимо создать класс, унаследованный от `WriteChannelContent` ([ссылка на API](https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/-write-channel-content/index.html)). Пример кода:

```kotlin
private class PhotoChannelContentStream(
    private val photo: ByteArray
) : OutgoingContent.WriteChannelContent() {
    override suspend fun writeTo(channel: ByteWriteChannel) {
        channel.writeFully(photo, 0, photo.size)
    }

    override val contentType: ContentType = ContentType.Application.OctetStream
    override val contentLength: Long = photo.size.toLong()
}
```
При реализации такого подхода возможно только использование `MultiPartFormDataContent` в качестве *body*.
Пример использования *ktor client*:

```kotlin
httpClient.put {
    ...
    setBody(PhotoChannelContentStream(image))
    ...
}
```

Про разницу типов содержимого более подробно можно прочитать по этой [ссылке](https://russianblogs.com/article/2287567080/)

## Загрузка файлов 

Ознакомьтесь с [документацией](https://ktor.io/docs/client-responses.html#streaming-data) Ktor и [статьей](https://blog.kotlin-academy.com/download-files-with-ktor-and-coroutines-e96b1cc8b657) про загрузку файлов, используя Ktor.

### Загрузка файлов в кеш

Если в приложении есть работа с какими-то файлами, то имеет смысл загрузить их в кэш приложения, чтобы обеспечить к ним более быстрый доступ и, тем самым, ускорить работу приложения.   

Разберем кэширование на примере работы с картинками - юзер выбирает картинку с устройства, прикрепляет ее к сообщению - картинка из памяти устройства сохраняется в кэш, в сообщении сохраняется путь до этой картинки. Когда он просмотрит это сообщение, например, после повторного открытия приложения - картинка уже будет загружаться из кэша, что значительно ускорит процесс ее загрузки.

#### на Android

Для начала - у нас есть кнопка, нажимая на которую мы запускаем [неявный Intent](https://developer.android.com/guide/components/intents-filters#ExampleSend) `ACTION_PICK`.
```kotlin
binding.attachImgButton.setOnClickListener {
    val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.INTERNAL_CONTENT_URI)
    startActivityForResult(intent, PICK_IMAGE_REQUEST_CODE)
}
```
И обрабатываем результат, который вернула нам эта активити:
```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, returnIntent: Intent?) {
    if (resultCode != Activity.RESULT_OK) {
        return
    }
    
    returnIntent?.data?.also { returnUri ->
        // получаем имя файла если есть, иначе создаем со своим
        val fileName = returnUri.lastPathSegment ?: "MyCachedImageFile"
        // создаем файл в кэшах приложения
        val cachedImageFile = File
            .createTempFile(fileName, ".jpeg", requireContext().cacheDir)
        // продолжаем логику, когда файл уже загружен в кэш
        viewModel.onFilesLoaded(imageTitle = fileName, imagePath = cachedImageFile.path)
    }
}
```

#### на iOS
По нажатию кнопки запускаем [UIImagePickerController](https://developer.apple.com/documentation/uikit/uiimagepickercontroller), который предоставляет системный интерфейс для выбора картинок из галереи, фото с камеры, записи видео, и т.д.
```swift
    @IBAction private func onAttachFilesButtonPressed(_: Any) {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        
        // указываем, откуда хотим получать картинку - photoLibrary
        if UIImagePickerController.isSourceTypeAvailable(.photoLibrary) {
            imagePicker.sourceType = .photoLibrary
            self.present(imagePicker, animated: true)
        }
    }
```

```swift
    func imagePickerController(_: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        guard let selectedImage = info[.originalImage] as? UIImage,
              let imageUrl = info[.imageURL] as? URL else { return }
        // получаем путь до директории кэшэй
        guard let cacheURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first else { return }

        // получаем путь, куда будет сохранена наша картинка 
        let imageCacheURL: URL = cacheURL.appendingPathComponent(imageUrl.lastPathComponent)

        // пробуем сохранить картинку в кэш
        do {
            try data.write(to: imageCacheURL)
        } catch let e {
            print("Error saving data in cache: \(e)")
        }
        
        // продолжаем логику, когда файл уже загружен в кэш
        issuesViewModel.onFilesLoaded(imagePath: imageCacheURL.path, imageTitle: imageUrl.lastPathComponent)

        dismiss(animated: true, completion: nil)
    }
```
