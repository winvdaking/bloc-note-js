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
        constructor(list){
            this.list = list
        }

        addNote(note){
            this.list.push(note);
        }

        get(n){ return this.list[n]; }

        getList(){ return this.list; }

        save(){
            localStorage.setItem('list', JSON.stringify(this.list));
        }

        load(){
            let notes = JSON.parse(localStorage.getItem('list'));
            notes.forEach(element => {
                new NoteListView().displayItem(element);
            });
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
    }

    const noteForm = new NoteFormView();
    const App = new MainApp(noteForm);
    
    App.init();

    const listNotes = new NoteList([]);
    listNotes.load();

    document.querySelector('#form_add_note_valid').addEventListener('click', (handler) => {
        noteForm.validate();
    });

});