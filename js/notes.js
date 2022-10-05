'use strict';
window.addEventListener('load', () => {

    class Note{

        constructor(titre, contenu){
            this.titre = titre;
            this.contenu = contenu;
            this.date_creation = new Date();
        }

        setTitre(titre){ this.titre = titre; }
        setContenu(contenu){ this.contenu = contenu; }
    }

    class NoteFormView{

        constructor(){};

        display(){
            document.getElementById('noteForm').classList.remove('create_edit_note-hidden');
        }

        hide(){
            document.getElementById('noteForm').classList.add('create_edit_note-hidden');
        };

        validate(){
            let title = document.getElementById('form_add_note_title').value;
            let contenu = document.getElementById('form_add_note_text').value;
            let laNote = new Note(title, contenu);
            let noteV = new NoteView(laNote);
            noteV.afficher();
            let noteListV = new NoteListView();
            noteListV.displayItem(laNote);
            let nt = new NoteList([]);
            nt.addNote(laNote);
            nt.save();
        };
    }

    class NoteView{
        constructor(note){
            this.note = note;
        }

        convertir(){
            let conv = new showdown.Converter();
            let html = `<h1>${this.note.titre}</h1><div>${conv.makeHtml(this.note.contenu)}</div>`;
            return html;
        }

        afficher(){
            document.querySelector('#currentNoteView').innerHTML = this.convertir(this.note);
        }
    }

    class MainMenuView{
        constructor(){}

        addHandler(){
            new NoteFormView().display();
        }

        init(){
            document.querySelector('#add').addEventListener('click', (handler) => {
                this.addHandler();
            });
        }
    }

    class NoteList{
        constructor(list, index = 0){
            this.list = list
            this.index = localStorage.getItem('index');
        }

        addNote(note){
            this.list.push(note);
            localStorage.setItem('index', this.index++);
        }

        get(n){ return this.list[n]; }

        getList(){ return this.list; }

        save(){
            localStorage.setItem('index', this.index);
            localStorage.setItem(this.index, JSON.stringify(this.list));
        }

        load(){
            this.index=localStorage.getItem('index');
            for (let i = 0; i < this.index+1; i++) {
                let notes = JSON.parse(localStorage.getItem(i));
                if (notes) {
                    notes.forEach(element => {
                        new NoteListView().displayItem(element);
                    });
                }
            }
        }
    }

    class NoteListView{
        constructor(){}

        displayItem(note){
            let item = document.createElement('div');
            item.classList.add('note_list_item');
            item.innerText = `${note.titre}\n${note.date_creation.toLocaleString()}`;
            document.getElementById('noteListView').appendChild(item);
            document.querySelectorAll('.note_list_item').forEach(element => {
                if (element.classList.contains('note_list_item-selected')) {
                    element.classList.remove('note_list_item-selected');
                }
            });
            item.classList.add('note_list_item-selected');
        }
    }

    class MainApp{
        constructor(noteCourante){
            this.noteCourante = noteCourante;
        }

        init(){
            let menu = new MainMenuView();
            menu.init();
        }

        delete(index){
            console.log(index);
            localStorage.removeItem(index);
            localStorage.splice();
            localStorage.setItem('index', localStorage.getItem('index')-1);
            document.getElementById('currentNoteView').classList.add('create_edit_note-hidden');
        }
    }


    /**
     * Initialisation de l'application
     */
    const noteForm = new NoteFormView();
    const App = new MainApp(noteForm);
    App.init();

    const listNotes = new NoteList([]);
    listNotes.load();

    document.querySelector('#form_add_note_valid').addEventListener('click', (handler) => {
        noteForm.validate();
    });

    /**
     * Lorsqu'on clique sur une note dans la liste, elle s'affichera
     */
    let lesNotesChargees = document.getElementsByClassName('note_list_item');
    for (let i = 0; i < lesNotesChargees.length; i++) {
        const element = lesNotesChargees[i];
        element.addEventListener('click', (handler) => {
            // Retire la class css note_list_item_selected des autres éléments
            document.querySelectorAll('.note_list_item').forEach(element => {
                if (element.classList.contains('note_list_item-selected')) {
                    element.classList.remove('note_list_item-selected');
                }
            });
            // Ajoute la class selected sur l'élément courant
            element.classList.add('note_list_item-selected');
            // On affiche la note
            new NoteView(JSON.parse(localStorage.getItem(i+1))[0]).afficher();

            document.getElementById('del').addEventListener('click', (handler) => {
                App.delete(i);
            });
        });
    }



});