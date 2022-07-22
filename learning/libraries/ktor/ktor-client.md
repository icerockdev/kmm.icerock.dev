# ktor-client

Библиотека работы с сетью. Основная документация
доступна [на сайте](https://ktor.io/docs/getting-started-ktor-client.html).  
В проектах IceRock библиотека используется в паре
с [moko-network](https://github.com/icerockdev/moko-network), которая генерирует из OpenAPI
спецификации весь сетевой код и сетевые сущности (с сериализацией
через [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)).

Начиная с ktor 1.4.0 на iOS библиотека требует использования native-mt версии корутин (внутри ktor
реализована полноценная многопоточность с обработкой всего pipeline на фоновом потоке).

## Особенности инициализации

Начиная с ktor 1.4.1 все блоки настроек features замораживаются на iOS. Поэтому требуется подходить
к инициализации HttpClient'а аккуратно.

Важно не подавать в лямбды настроек ничего, что нельзя заморозить. Например передавать `this`
объекта (то есть нельзя работать с полями класса, надо сохранить их в локальные переменные в стеке,
а потом уже эти переменные использовать в лямбде).

Например:

```kotlin
// обертка над https://github.com/russhwolf/multiplatform-settings с свойствами для доступа к хранилищу
private val keyValueStorage: KeyValueStorage by lazy {
    KeyValueStorage(settings)
}

// парсер json от https://github.com/Kotlin/kotlinx.serialization
private val json: Json by lazy {
    Json {
        // чтобы если в api появятся новые ключи то у нас приложение их будет игнорировать, а не крашиться
        ignoreUnknownKeys = true
    }
}

private val httpClient: HttpClient by lazy {
    // Ссылки на инстансы зависимостей для фичей клиента, чтобы не замораживать для KN объект
    // SharedFactory через ссылки на this (httpClient в некоторый момент может заморозиться -
    // что приведет к заморозке фичей и всех зависимостей фичей).
    // https://kotlinlang.org/docs/native-immutability.html
    // https://kotlinlang.org/docs/native-concurrency.html
    val json = this.json
    val keyValueStorage = this.keyValueStorage

    HttpClient {
        // включаем ExceptionFeature из moko-network для обработки ошибок
        install(ExceptionFeature) {
            exceptionFactory = HttpExceptionFactory(
                defaultParser = ErrorExceptionParser(json),
                customParsers = mapOf(
                    HttpStatusCode.UnprocessableEntity.value to ValidationExceptionParser(json)
                )
            )
        }
        // выключаем стандартный BadResponseStatus чтобы работала ExceptionFeature
        expectSuccess = false

        // включаем логирование запросов
        install(Logging) {
            logger = Logger.DEFAULT // TODO сменить на Napier с шарингом между потоками
            level = LogLevel.INFO
        }
    }
}
```

## Получение HttpResponse

При выполнении запроса мы можем указать тип ответа, который мы хотим получить. И ktor-client
автоматически
постарается [привести полученный от сервера ответ в нужный нам тип](https://ktor.io/docs/response.html)
. За это отвечает `responsePipeline`, который обрабатывается при выполнении `receive` у
класса `HttpResponse`. На данном пайплайне находится и логика `ExceptionFeature` и
логика `JsonFeature` и многие другие.

В случае если хочется выполнить запрос с полностью кастомной логикой обработки ответа, которая не
будет проходить через `responsePipeline`, можно сделать так:

```kotlin
val response = httpClient.get<HttpResponse>(requestUrl)

if (response.status.isSuccess()) {
    // success handle
} else {
    val statusCode: HttpStatusCode = response.status
    // read text without call responsePipeline in ktor
    val body: String = String(response.content.toByteArray())
}
```

В примере мы не обращаемся к `response.receive` чтобы не происходила обработка `responsePipeline`.
Вместо этого мы работаем напрямую с `response.content`, который является чистым видом пришедших от
сервера данных.

## Добавление логики в обработку каждого запроса/ответа

Для этого используются Ktor Features, которые позволяют поставить дополнительные блоки на pipeline.
Примеры использования стандартных фич можно посмотреть в
статье [Kotlin Multiplatform Mobile: Intercepting Network Request and Response](https://yusufabd.medium.com/kotlin-multiplatform-mobile-intercepting-network-request-and-response-6805a79b4699)

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

Данный подход хорошо описан в документации ktor ([ссылка на документацию](https://ktor.io/docs/request.html#upload_file)).
Важной деталью в данной ссылке является добавление заголовка с файлом, который представлен в виде `byteArray`:
```kotlin
...
append("image", File("ktor_logo.png").readBytes(), Headers.build {
    append(HttpHeaders.ContentType, "image/png")
    append(HttpHeaders.ContentDisposition, "filename=ktor_logo.png")
})
...
```

### Передача файла как Input

Этот подход подразумевает использование *kotlinx-io* `Input` ([ссылка на класс](https://ktor.kotlincn.net/kotlinx/io/io/input-output.html)). В таком случае используется другой подход формирования `formData`:
```kotlin
val data: List<PartData> = formData {
    appendInput(
        key = "yourKey",
        block = { input },
        headers = Headers.build {
            append(
                HttpHeaders.ContentType,
                ContentType.Application.OctetStream.toString()
            )
            append(
                HttpHeaders.ContentDisposition, ContentDisposition.File
                    .withParameter(ContentDisposition.Parameters.FileName, fileName)
                    .toString()
            )
        }
    )
}
```
В примере представлен вариант добавления `headers`, по умолчанию *Empty*. Здесь можно конфигурировать хедеры под ваши нужды.

Касаемо использования formData, существует несколько подходов в формировании *ktor* HTTP клиента:

### Передача файла как Input в common коде

Чтобы реализовать потоковую передачу файла в общем коде, используя ktor, необходимо получить объект [Input](https://api.ktor.io/older/1.6.8/ktor-io/io.ktor.utils.io.core/-input/index.html) на основе файла. Сделать это в общем коде можно используя expect/actual функции:  

***commonMain:***
```kotlin
expect fun inputByFilepath(filePath: String): Input
```
***androidMain:***
```kotlin
actual fun inputByFilepath(filePath: String): Input{
    val file = File(filePath)
    val inputStream = file.inputStream()
    return inputStream.asInput()
}
```
***iosMain:***
```kotlin
actual fun inputByFilepath(filePath: String): Input {
    val fileHandle = NSFileHandle.fileHandleForReadingAtPath(path = filePath)
    return Input(fileHandle!!.fileDescriptor)
}
```

### submitFormWithBinaryData

Для использования этого метода необходимо заранее сформировать `formData`. Код с таким методом выглядит следующим образом:
```kotlin
val result = httpClient.submitFormWithBinaryData<String>(formData = data) {
    ...
}
```
Здесь `data` - сформированная *multipart formData*. В теле httpClient возможны настройки самого клиента, в том числе url, хедеры, тип метода (**важный поинт - multipart/form-data запросы должны быть только POST запросами!**)

### MultiPartFormDataContent

Здесь для ktor клиента в качестве *body* присваивается `MultiPartFormDataContent()`, параметром является список `PartData`, формируемый `formData`. Пример кода:
```kotlin
val result = httpClient.post<Unit> {
    ...
    body = MultiPartFormDataContent(parts = data)
}
```

### application/octet-stream

Данный подход используется довольно редко, но все же используется. Для данного типа запроса нет возможности передать несколько параметров или файлов, можно отправлять файл, притом только один. Для реализации подхода необходимо создать класс, унаследованный от `WriteChannelContent` ([ссылка на класс](https://www.mvndoc.com/c/io.ktor/ktor-http-iosarm64/io/ktor/http/content/OutgoingContent.WriteChannelContent.html)). Пример кода:
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
httpClient.put<String> {
    ...
    body = PhotoChannelContentStream(image)
    ...
}
```

Про разницу типов содержимого более подробно можно прочитать по этой [ссылке](https://russianblogs.com/article/2287567080/)

## Загрузка файлов 
Ознакомьтесь с [документацией](https://ktor.io/docs/response.html#streaming) Ktor и [статьей](https://blog.kotlin-academy.com/download-files-with-ktor-and-coroutines-e96b1cc8b657) про загрузку файлов, используя Ktor.

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
