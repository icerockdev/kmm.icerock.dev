# Adapter and listeners

## Требования к Adapter
При создании списка элементов, например, `RecyclerView`, необходимо создать класс `Adapter`, чтобы связать элементы со списком.

***Как должен выглядеть адаптер:*** 
- Адаптер не должен сам обрабатывать действия по нажатию на элемент и т.д.
- Если должно быть действие по нажатию на элемент, то адаптер должен получать лямбду при создании, которую привяжет к действию с элементом
- Единственная задача адаптера - это привязать данные к `RecyclerView`, в адаптере не должно содержаться никакой логики 

***Зачем это, почему бы не задать логику внутри адаптера?*** 
- В [документации](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter) сказано, что `Adapters provide a binding from an app-specific data set to views that are displayed within a RecyclerView` т.е. задача адаптера - это лишь связать данные с отображением на UI.
- Так как мы в наших проектах придерживаемся паттерна прогроммирования MVVM, вся логика приложения сосредаточена во вьюмоделях. Если логика будет размещена не только во вьюмоделях, то, со временем, ориентироваться в проекте станет гораздо сложнее

## Пример простого адаптера, для списка элементов

`text_row_item.xml`:
```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="30dp"
    android:layout_marginLeft="10dp"
    android:layout_marginRight="10dp"
    android:gravity="center_vertical">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text=""/>
</FrameLayout>
```

`CustomAdapter:`
```kotlin
class CustomAdapter(private val dataSet: Array<String>, private val onClick: (String) -> Unit) :
    RecyclerView.Adapter<CustomAdapter.ViewHolder>() {

    class ViewHolder(view: View, onClick: (String) -> Unit ) : RecyclerView.ViewHolder(view) {
        val textView: TextView

        init {
            textView = view.findViewById(R.id.textView)
            view.setOnClickListener { onClick(textView.text.toString()) }
        }
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int ): ViewHolder {
        val view = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.text_row_item, viewGroup, false)

        return ViewHolder(view, onClick)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        viewHolder.textView.text = dataSet[position]
    }

    override fun getItemCount() = dataSet.size
}
```