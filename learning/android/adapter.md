# Adapter and listeners

## Требования к Adapter
Для создания динамического списка элементов, например [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview), необходимо создать [Adapter](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter), чтобы связать элементы со списком. Задача адаптера - `Adapters provide a binding from an app-specific data set to views that are displayed within a RecyclerView` из [документации](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter) т.е. лишь связать данные с отображением на UI

***Как должен выглядеть адаптер:***

- адаптер не должен содержать никакой логики по взаимодействию с элементами списка. Если нужно установить действие, например по нажатию на элемент, то адаптер должен получать лямбду при создании, которую потом привяжет к действию над элементом
- единственная задача адаптера - это привязать данные к `RecyclerView`

## Пример простого адаптера

Разберем пример, у нас есть `Activity` со списком элементов, мы хотим, чтобы по нажатию на элемент что-то происходило, для демонстрации просто покажем [Toast](https://developer.android.com/reference/android/widget/Toast).

Сначала создадим ячейку нашего списка `text_row_item.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text=""
        tools:text="sample" />
</FrameLayout>
```

Затем, добавим список на `activity_main.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.recyclerview.widget.RecyclerView 
    android:id="@+id/recyclerView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:listitem="@layout/text_row_item" />
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

## Зачем нужен вьюхолдер?

Цель RecyclerView - переиспользовать вьюхи списка, а не грузить сразу все. Для этого, проверяется, возможно ли взять уже существующую, или нужно создавать новую.
Если получилось взять существующую - то в ней лежит объект viewHolder, через который можно достучаться до элементов переиспользуемой вьюхи, которые мы собираемся переопределять. т.е. нет необходимости вызывать метод findViewById, чтобы достучаться до элементов вью

Хоть у нас и есть доступ к `view` элемента в методе `onCreateViewHolder`, устанавливать там `onClickListener` нельзя, потому что задача `viewHolder-a` - это только держать ссылки на вьюхи элементов. Изучите [документацию](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.ViewHolder)  
Еще одна причина, почему привязка onClick должна быть в [onBindViewHolder](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.Adapter#onBindViewHolder(VH,%20int)) - это то, что vieHolder-ы можно переиспользовать между несколькими recyclerView, например для составных списков (вертикальный список из горизонтальных списков). Будет создано несколько recyclerView, и, если они будут объединены в один [RecycledViewPool](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.RecycledViewPool) то они смогут обмениваться viewHolder-ами, именно поэтому viewHolder не должен привязываться к конкретному объекту адаптеру, который его создал, потому что потом его может использовать другой адаптер. И именно в методе `onBindViewHolder` есть гарантия, что переданный viewHolder относится к нашим данным.

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
