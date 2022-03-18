# Adapter and listeners

## Требования к Adapter
Для создания динамического списка элементов, например [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview), необходимо создать [Adapter](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter), чтобы связать элементы со списком.

***Как должен выглядеть адаптер:***

- адаптер не должен содержать никакой логики по взаимодействию с элементами списка. Если нужно установить действие, например по нажатию на элемент, то адаптер должен получать лямбду при создании, которую потом привяжет к действию над элементом
- единственная задача адаптера - это привязать данные к `RecyclerView`

***Почему бы не задать логику внутри адаптера?*** 
- из [документации](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter): `Adapters provide a binding from an app-specific data set to views that are displayed within a RecyclerView` т.е. задача адаптера - это лишь связать данные с отображением на UI

## Пример простого адаптера

Разберем пример, у нас есть `Activity` со списком элементов, мы хотим, чтобы по нажатию на элемент что-то происходило, для демонстрации просто покажем [Toast](https://developer.android.com/reference/android/widget/Toast).

Сначала создадим ячейку нашего списка `text_row_item.xml`:
```xml

<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="30dp"
    android:layout_marginLeft="10dp" android:layout_marginRight="10dp"
    android:gravity="center_vertical">

    <TextView android:id="@+id/textView" android:layout_width="wrap_content"
        android:layout_height="wrap_content" android:text="" />
</FrameLayout>
```

Затем, добавим список на `activity_main.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools" android:layout_width="match_parent"
    android:layout_height="match_parent" tools:context=".MainActivity">

  <androidx.recyclerview.widget.RecyclerView android:id="@+id/recyclerView"
          android:layout_width="wrap_content" android:layout_height="200dp"
          tools:listitem="@layout/text_row_item" app:layout_constraintTop_toTopOf="parent"
          app:layout_constraintBottom_toBottomOf="parent"
          app:layout_constraintRight_toRightOf="parent"
          app:layout_constraintLeft_toLeftOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

Создадим `CustomAdapter`, который при создании будет принимать onClick-лямбду. Значения будут устанавливаться не в конструкторе, а просто в переменную, как только установятся - вызовется [notifyDataSetChanged()](https://developer.android.com/reference/android/widget/BaseAdapter#notifyDataSetChanged())  
```kotlin
class CustomAdapter(private val onItemClick: (Int) -> Unit) :
    RecyclerView.Adapter<CustomAdapter.ViewHolder>() {

    var items: List<String> = emptyList()
        set(value) {
            field = value
            notifyDataSetChanged()
        }

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textView: TextView = view.findViewById(R.id.textView)
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.text_row_item, viewGroup, false)

        return ViewHolder(view)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        viewHolder.textView.text = items[position]
        viewHolder.itemView.setOnClickListener { onItemClick(position) }
    }

    override fun getItemCount() = items.size
}
```
Хоть у нас и есть доступ к `view` элемента в методе `onCreateViewHolder`, устанавливать там `onClickListener` нельзя, потому что задача `viewHolder-a` - это только держать ссылки на вьюхи элементов. Изучите [документацию](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.ViewHolder)  
Поэтому, привязываем onClick в [onBindViewHolder](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter#onBindViewHolder(VH,%20int)) - где происходит непосредсвтенно отображение нужного элемента из списка

 **Я помню, что там что-то про findViewById, что она дорогая и что её лишний раз лучше не трогать, но описать не могу, как она ведет себя если мы онклил делаем во вьхолдере**

Наконец, создадим наш адаптер, проинициализируем элементами с лямбдой и привяжем к `recyclerView`:

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val dataSet = listOf("aaa", "bbb", "ccc", "ddd", "fff", "jjj","aaa", "bbb", "ccc", "ddd", "fff", "jjj")
        val customAdapter = CustomAdapter { onItemClick(dataSet[it]) }
        customAdapter.items = dataSet

        val recyclerView: RecyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = customAdapter
    }

    private fun onItemClick(title: String) {
        Toast.makeText(this, "tap on $title", Toast.LENGTH_SHORT).show()
    }
}
```

## Закллючение

- передача элементов в адаптер должна быть не через конструктор, а через изменяемую переменную
- в адаптере не должно содержаться никакой логики, только реализация системных функций
- задача `viewHolder-а` - держать ссылки на вьюхи
- установка onClick-лямбды должна быть в onBindViewHolder
