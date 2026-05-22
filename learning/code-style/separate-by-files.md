---
sidebar_position: 7
---

# Разделение по файлам

1. Классы/интерфейсы/объекты располагаются в своем файле (два класса в одном файле не приветствуется). В файле рядом с основным объявлением (класс/интерфейс/объект) могут находиться различные **extension** методы, относящиеся к этому классу. Например, в файле класса доменной сущности может объявляться extension для маппинга из сетевой сущности:

    Например:
    ```kotlin
    class ScheduleDeviceDomain(
        val id: Int,
        val name: String,
        val timezone: TimeZoneDomain?,
        val deviceParameters: List<DeviceParameterDomain>
    )
    
    internal fun DeviceFullResponse.toScheduleDeviceDomain() = ScheduleDeviceDomain(
        id = this.id,
        name = this.name,
        timezone = this.timezone?.toDomain(),
        deviceParameters = this.parameterList?.map(Parameter::toDomain).orEmpty()
    )
    ```
