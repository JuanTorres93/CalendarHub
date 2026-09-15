const tutorialImage = (fileName) => {
  return `${import.meta.env.BASE_URL}images/tutorial/${fileName}`;
};

export const tutorialSlides = [
  {
    chapter: "Benvenuto",
    image: tutorialImage("mese.jpeg"),
    title: "Benvenuto in CalendarHub",
    text: "Questa guida ti mostra passo dopo passo come usare CalendarHub e sentirti subito a casa.",
  },

  // ---------------- NAVIGAZIONE ----------------

  {
    chapter: "Navigazione",
    image: tutorialImage("slide-1.png"),
    title: "Cambio vista",
    text: "Puoi passare tra vista mese, settimana e giorno usando i pulsanti in alto.",
  },
  {
    chapter: "Navigazione",
    image: tutorialImage("slide-2.png"),
    title: "Cambio periodo",
    text: "Per navigare tra i vari periodi dell'anno usa le frecce affiancate al nome del mese, della settimana o del giorno corrispondente.",
  },
  {
    chapter: "Navigazione",
    image: tutorialImage("slide-6.png"),
    title: "Vista mensile",
    text: "La casella del giorno corrente viene evidenziata con un colore più scuro. Cliccando sul numero del giorno imposterai quella data come attiva. Cliccando invece nello spazio interno della casella potrai aprire il menu eventi relativo a quella giornata.",
  },
  {
    chapter: "Navigazione",
    image: tutorialImage("slide-7.png"),
    title: "Vista settimanale",
    text: "Il giorno della settimana selezionato viene evidenziato con una colorazione più scura. Cliccando sul pulsante del giorno evidenziato in blu, imposterai quella come data attiva del calendario. Se desideri aprire il menù degli eventi, clicca all'interno di una delle celle orarie della griglia il menu eventi verrà aperto direttamente con l’orario corrispondente.",
  },
  {
    chapter: "Navigazione",
    image: tutorialImage("slide-8.png"),
    title: "Vista giornaliera",
    text: "Puoi cambiare giorno usando le frecce superiori. Cliccando sulle celle della griglia oraria il menu eventi si aprirà automaticamente con l’orario selezionato.",
  },

  // ---------------- MINI CALENDARIO ----------------

  {
    chapter: "Mini Calendario",
    image: tutorialImage("slide-3.png"),
    title: "Apertura mini calendario",
    text: "Cliccando sul nome del mese, della settimana o del giorno puoi aprire il mini calendario e scegliere rapidamente una data.",
  },
  {
    chapter: "Mini Calendario",
    image: tutorialImage("slide-4.png"),
    title: "Selezione data",
    text: "Seleziona un giorno cliccando sulla casella evidenziata. Puoi anche scegliere rapidamente il mese desiderato tramite il selettore dedicato.",
  },
  {
    chapter: "Mini Calendario",
    image: tutorialImage("slide-5.png"),
    title: "Input manuale",
    text: "Puoi inserire manualmente una data usando il formato dd/mm/aaaa. Premi 'Salva' per confermare oppure 'Annulla' per chiudere senza modifiche.",
  },

  // ---------------- EVENTI ----------------

  {
    chapter: "Eventi",
    image: tutorialImage("slide-9.png"),
    title: "Creazione evento",
    text: "Il menu eventi permette di creare eventi completi aggiungendo titolo, descrizione, icona, colore, notifiche, data e orario. Clicca sui Pulsanti con colorazione nera per aggiornare il rispettivo campo",
  },
  {
    chapter: "Eventi",
    image: tutorialImage("slide-10.png"),
    title: "Eventi ricorrenti",
    text: "Puoi creare eventi giornalieri, settimanali, mensili o personalizzati, cliccando sul bottone nero evidenziato. CalendarHub genera automaticamente le occorrenze mantenendo sincronizzate tutte le viste.",
  },
  {
    chapter: "Eventi",
    image: tutorialImage("slide-11.png"),
    title: "Eventi Settimanali",
    text: "Ad Esempio, per l'occorrenza settimanale, puoi scegliere l'intervallo tra settimane, quali giorni ripetere e una data di conclusione.",
  },
  {
    chapter: "Eventi",
    image: tutorialImage("slide-12.png"),
    title: "Eventi Personalizzati",
    text: "Oppure scegli direttamente le date in cui il tuo evento verrà ripetuto, cliccando sul bottone a fianco di 'date personalizzate'. Puoi inoltre cancellare una data semplicemente cliccando sull'icone 'x' a fianco della data corrispondente.",
  },

  // ---------------- INFO BANNER ----------------

  {
    chapter: "Info Banner",
    image: tutorialImage("slide-13.png"),
    title: "Informazioni evento",
    text: "Cliccando su un evento già esistente si apre un pannello contestuale contenente tutte le informazioni principali dell’evento.",
  },
  {
    chapter: "Info Banner",
    image: tutorialImage("slide-14.png"),
    title: "Azioni rapide",
    text: "L’Info Banner permette di modificare o eliminare rapidamente eventi tramite i pulsanti dedicati.",
  },
  {
    chapter: "Info Banner",
    image: tutorialImage("slide-15.png"),
    title: "Azioni avanzate",
    text: "L’Info Banner permette di gestire con estrema libertà la modifica o eliminazione di eventi facenti parte di una serie. Interagendo con il singolo evento o con tutti gli eventi.",
  },

  // ---------------- TODO ----------------

  {
    chapter: "ToDo List",
    image: tutorialImage("slide-16.png"),
    title: "Aprire la ToDo List",
    text: "Premi il pulsante dedicato nella barra superiore per aprire il pannello della ToDo List. All’interno del pannello, premi “New” per iniziare a creare una nuova lista di attività. Premi il pulsante a croce per chiudere il pannello.",
  },
  {
    chapter: "ToDo List",
    image: tutorialImage("slide-17.png"),
    title: "Creare una nuova lista",
    text: "Inserisci un titolo per creare una ToDo List collegata alla data attualmente selezionata nel calendario. Una volta inserito il titolo, la lista verrà salvata automaticamente. Puoi eliminarla in qualsiasi momento usando il pulsante a forma di cestino accanto al titolo.",
  },
  {
    chapter: "ToDo List",
    image: tutorialImage("slide-18.png"),
    title: "Aggiungere attività",
    text: "Per aggiungere una nuova attività, scrivi il contenuto nel campo “Nuova attività” e premi il pulsante accanto alla casella di testo. Puoi aggiungere tutte le attività che vuoi alla lista corrente.",
  },
  {
    chapter: "ToDo List",
    image: tutorialImage("slide-19.png"),
    title: "Gestire le attività",
    text: "Ogni attività può essere marcata come completata o riportata come non completata. Puoi anche eliminarla usando il pulsante dedicato accanto all’attività. Il contatore della lista si aggiornerà automaticamente.",
  },
  {
    chapter: "ToDo List",
    image: tutorialImage("slide-20.png"),
    title: "Indicatori nel calendario",
    text: "Quando crei una ToDo List, CalendarHub mostra un’icona nel calendario per indicare che in quella giornata sono presenti una o più liste. L’indicatore è visibile nella vista mensile, settimanale e giornaliera.",
  },
  {
    chapter: "ToDo List",
    image: tutorialImage("slide-21.png"),
    title: "Riaprire una lista salvata",
    text: "Premendo sull’icona della ToDo List si apre un menu con le liste presenti per quella giornata. Cliccando su una lista salvata, potrai riaprirla, modificarla, completare attività, eliminarle o cancellare l’intera lista.",
  },
  // ---------------- NOTIFICHE ----------------

  {
    chapter: "Notifiche",
    image: tutorialImage("slide-22.png"),
    title: "Attivare le notifiche",
    text: "Premi il pulsante con la campanella sbarrata nella barra superiore per attivare le notifiche. Al primo utilizzo, il browser potrebbe chiederti di concedere il permesso. Quando le notifiche sono attive, l’icona cambia e CalendarHub potrà ricordarti gli eventi secondo l’anticipo selezionato.",
  },
  {
    chapter: "Notifiche",
    image: tutorialImage("slide-23.png"),
    title: "Disattivare le notifiche",
    text: "Premi nuovamente il pulsante con la campanella per disattivare le notifiche di CalendarHub. La preferenza viene salvata automaticamente. Le notifiche funzionano principalmente mentre CalendarHub è aperto e il supporto può variare sui dispositivi mobili.",
  },

  // ---------------- FINE ----------------

  {
    chapter: "Fine",
    image: tutorialImage("slide-24.png"),
    title: "Fine del tutorial",
    text: "Hai completato la guida! 🎉 Ora sei pronto per usare CalendarHub ed esplorare tutte le funzionalità disponibili. Per rivedere il tutorial premi il pulsante dedicato in alto!",
  },
];
