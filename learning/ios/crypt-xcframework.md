# Шифрование файлов при поставке готового XCFramework

XCFramework — это формат архива, который позволяет собрать библиотеку или фреймворк для различных платформ и архитектур. Как правило, разработчики используют XCFramework для упрощения процесса сборки и развертывания своих приложений на различных устройствах.

Однако, при поставке готового XCFramework возникает вопрос о безопасности и конфиденциальности данных, хранящихся в этом архиве. Ведь библиотеки и фреймворки могут содержать конфиденциальную информацию, такую как ключи API, пароли и другие данные, которые не должны быть доступны посторонним.

## Шифрование

Для обеспечения безопасности и конфиденциальности данных при поставке готового XCFramework разработчики могут использовать шифрование файлов. Шифрование позволяет защитить данные от несанкционированного доступа и использования.

Существует несколько способов шифрования файлов при поставке готового XCFramework. Для шифрования обычно используются такие шифры как DES или AES, в некоторых случая можно использовать а ассиметричные шифры, такие как RSA, DSA, Схему Эль-Гамаля или шифрование на элиптических кривых.

AES и DES являются симметричными алгоритмами шифрования, который использует один и тот же ключ для шифрования и дешифрования данных. Ключ может быть сгенерирован случайным образом и передан отдельно от XCFramework или зашит в него

Ассиметричные шифры, такие как AES, подразумевают использование публичного и приватного ключа. В данном случае закрытый ключ может быть передан отдельно от XCFramework, а открытый ключ может быть встроен в XCFramework.

## Пример DES шифрования файлов 

Для того чтобы зашифровать файл при помощи алгоритма DES можно воспользоваться инструментом opessl.

Для начала нам необходимо сгенерировать ключ, который мы будем использовать для шифрования/дешифрования файлов. 

Размер блока для DES равен 64 битам. В основе алгоритма лежит сеть Фейстеля с 16 циклами (раундами) и ключом, имеющим длину **56 бит**. _Ключ_ обычно представляется 64-битовым числом, но каждый восьмой бит используется для проверки четности и игнорируется. Алгоритм использует комбинацию нелинейных (S-блоки) и линейных (перестановки E, IP, IP-1) преобразований.

С помощью инструмента openssl можно создавать ключи определенной длины в бинарном, HEX или Base64 формате. Чтобы создать ключ длиной 64 бита в формате HEX, можно выполнить следующую команду:

```bash
openssl rand -hex 8
```

Результатом такой работы может служить следующая строка 

```
3fd6786e458fda1f
```

Это строка представляет собой 64-битный ключ.

### Шифрование

Полученный на предыдущем этапе ключ теперь нужно правильно применить для шифрования. 

Для большей конкретности представим, что внутри нашего фреймворка находятся файлы, содержащие обученную модель для нейронной сети с раширением `.mlmodel`.

Для шифрование такой модели `openssl` предоставляет необходимый функционал: 

```bash
openssl enc -des-ecb -in "model.mlmodel" -out "model.enc" -K 3fd6786e458fda1f
```

Полный список поддерживаемых `openssl` шифров можно посмотреть используя следующую команду:

```bash
openssl ciphers -v
```

Для простоты в рамках данной статьи мы будем использовать `des-ecb`.

### Шифрование сразу нескольких файлов

Для шифрования сразу нескольких файлов с раширением `.mlmodel` можно воспользоваться следующим скриптом:

```bash 
#!/bin/bash

# for in all files

for file in *

	do
	
	# check file extension .mlmodel
	
	if [[ "$file" == *.mlmodel ]]; then
	
		# set output file name
		
		out_file="${file%.*}.enc"
		
		# encoding with openssl
		
		openssl enc -des-ecb -in "$file" -out "$out_file" -K <your-key> # setup your 64 bit key
		
		echo "File $file encrypted and saved as $out_file"
	
	fi

done

```

После запуска данного скрипта, он зашифрует все файлы с расширением `.mlmodel` в той директории, в которой находится предложенный ***sh*** скрипт.

### Дешифровка файла со стороны iOS

После того как файлы зашифрованы и сложены в проект, нужно разобраться как с ними работать.

#### CryptoUtils

Для удобства работы с функциями дешифровки хорошо было бы создать специальный класс:

```swift 
class CryptoUtils {

	struct BundledFile {
		// ...
	}

	private static func decrypt(fileName: String, key: String) -> Data? {
		// ...
	}

  

	static func decryptAndGetBundledFile(filename: String) -> BundledFile? {
		// ...
	}
}
```

Для начала разберемся, в каком формате должны возвращаться данные из функции `decryptAndGetBundledFile`.

#### BundledFile

`BundledFile` должен содержать информацию о бандле декодированного файла, имени файла и его расширении и выглядит так:

```swift
struct BundledFile {
	let bundle: Bundle
	let fileName: String
	let ext: String
}
```

#### Decrypt

Метод `decrypt` принимает имя файла и ключ для расшифровки данных, а затем должен загружать файл из ресурсов `XCFramework'а` и производить его дешифровку.

```swift
private static func decrypt(fileName: String, password: String) -> Data? {

	guard let filePath = Bundle(for: Self.self).path(forResource: "mldata/\(fileName).enc", ofType: nil) else {
		return nil
	}
	
	let fileURL = URL(fileURLWithPath: filePath)
	
	let key = password.hexStringBytes
	
	// docoding
}
```

Для перевода строчного представления ключа в его битовое представление, можно использовать следующий экстеншен:

```swift
extension String {
	var hexStringBytes: [UInt8]? {
		var hex = self
		var bytes = [UInt8]()
		while !hex.isEmpty {
			let subIndex = hex.index(hex.startIndex, offsetBy: 2)
			if let byte = UInt8(hex[..<subIndex], radix: 16) {
				bytes.append(byte)
				hex = String(hex[subIndex...])
			} else {
				return nil
			}
		}
		return bytes
	}
}
```

Он позволяет преобразовывать строку, содержащую шестнадцатеричное представление байтов, в массив байтов `[UInt8]`.

Он выполняет это путем разбиения строки шестнадцатеричного кода на отдельные пары символов и преобразования каждой из этих пар в соответствующий байт типа UInt8 с использованием метода `UInt8(_:radix:)`. Затем он добавляет байты в массив и продолжает разбиение и преобразование, пока вся строка не будет прочитана.

Если в строке нечетное количество символов или символы не соответствуют шестнадцатеричному формату, метод вернет nil. В противном случае он вернет массив байтов, полученных из шестнадцатеричного представления строки.

Байтовое представление пароля необходимо передать в функцию `CCCrypt` из фреймворка `CommonCrypto`. Указав вид шифра, его опции, и IV, данный метод проведет дешифровку данных из файла и запишет дешифрованные данные в созданную переменную.

Полный код функции `decrypt`:

```swift
private static func decrypt(fileName: String, password: String) -> Data? {

	guard let filePath = Bundle(for: Self.self).path(forResource: "mldata/\(fileName).enc", ofType: nil) else {
		return nil
	}
	
	let fileURL = URL(fileURLWithPath: filePath)
	
	let key = password.hexStringBytes
	
	// docoding
	let iv = Array(repeating: UInt8(0), count: kCCBlockSizeDES)
	
	guard let data = try? Data(contentsOf: fileURL) else {
		return nil
	}
	
	let decryptLength = size_t(data.count + kCCBlockSizeDES)
	var decryptData = Data(count: decryptLength)
	var numBytesDecrypted: Int = 0
	
	let cryptStatus = decryptData.withUnsafeMutableBytes { decrypBytes in
		data.withUnsafeBytes { dataBytes in
			CCCrypt(
				CCOperation(kCCDecrypt),
				CCAlgorithm(kCCAlgorithmDES),
				CCOptions(kCCOptionECBMode),
				key,
				kCCKeySizeDES,
				iv,
				dataBytes, cryptLength,
				decrypBytes, decryptLength,
				&numBytesDecrypted
			)
		}
	}
	
	guard cryptStatus == kCCSuccess else {
		return nil
	}
	
	cryptData.removeSubrange(numBytesDecrypted..<decryptData.count)
	
	return cryptData
}
```

## Создание временного файла

С дешифровкой файлов разобрались, теперь нужно реализовать функцию, которая будет сохранять дешифрованные файлы для использование их фреймворком CoreML.

Всю работу с файловой системой содержит в себе функция `decryptAndGetBundledFile`:

```swift

private static func decryptAndGetBundledFile(
  filename: String, needRename: Bool = true
) -> BundledFile? {
	let pass = "<your-key>"
	
	// decrypt
	guard let data = decrypt(fileName: filename, password: pass) else { 
		return nil
	}

	// get data length
	let dataLength = data.count

	// get documents directory
	guard let dir = FileManager.default.urls(
		for: .documentDirectory, 
		in: .userDomainMask
	).first else { 
		return nil 
	}

	// create directory for decrypted files
	let mldataDirectory = dir.appendingPathComponent("mldata", isDirectory: true)
	if !FileManager.default.fileExists(atPath: tdataDirectory.path) {
		do {
			try FileManager.default.createDirectory(
				at: mldataDirectory, 
				withIntermediateDirectories: true,
				attributes: nil
			)
		} catch {
			NSLog("Failed to create directory with \(error)")
			return nil
		}
	}

	// get original file name or create UUID
	let uuid: String = needRename ? UUID().uuidString : filename
	
	let addtionalPath = "mldata/\(uuid).mlmodel"

	// add filename to path
	let fileURL = dir.appendingPathComponent(addtionalPath)
	
	guard let fileURL = fileURL else { return nil }

	// file write operation
	do {
		try data.write(to: fileURL, options: .atomic)
		NSLog("write to URL = \(fileURL) success")
	} catch let error {
		NSLog("failed to write in \(fileURL) with \(error)")
	}

	// get file bundle
	guard let bundle = Bundle(url: dir) else { return nil }

	// create result
	let result = BundledFile(bundle: bundle, fileName: uuid, ext: "mlmodel")
	return result

}
```


## Заключение

Шифрование файлов при поставке готового XCFramework позволяет обеспечить безопасность и конфиденциальность данных. Однако, разработчики также должны учитывать возможные недостатки этого подхода. 

## Материалы:

https://developer.apple.com/documentation/xcode/creating-a-multi-platform-binary-framework-bundle
https://habr.com/ru/companies/true_engineering/articles/475816/
https://en.wikipedia.org/wiki/Data_Encryption_Standard
https://habr.com/ru/articles/140404/


