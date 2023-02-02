<template>
  <q-page padding>
    <!-- content -->
    <q-input label="New" v-model="newName" />
    <q-input label="update" v-model="updateName" />
    <q-input label="suche" v-model="suche" />
    <q-btn label="create" @click="create" />
    <q-btn label="add" @click="add" />
    <q-btn label="show" @click="show" />
    <q-btn label="allbooks" @click="allBooks" />
    <q-btn label="single" @click="findSingleBook" />
    <q-btn label="update" @click="modifyBook" />
    <q-btn label="changes" @click="showChanges" />
    <q-btn label="addAuthor" @click="addAuthor" />
    <q-btn label="findBooksOfAuthor" @click="findBooksOfAuthor" />
    {{ currentBook }}
    <q-input v-model="currentBook.title" v-if="currentBook" />
  </q-page>
</template>

<script lang="js">
import { defineComponent, ref } from 'vue'
import PouchDB from 'pouchdb-browser';
import bla from 'pouchdb-find'
import rel from 'relational-pouch';


PouchDB.plugin(bla);
PouchDB.plugin(rel);

export default defineComponent({
  // name: 'PageName'

  setup() {
    const newName = ref('walter')
    const updateName = ref('walter')
    const suche = ref('walter')
    // var db = new PouchDB('mittens');

    var db = new PouchDB('mydb2');

    db.setSchema([
      {
        singular: 'author',
        plural: 'authors',
        relations: {
          'books': { hasMany: 'book' }
        }
      },
      {
        singular: 'book',
        plural: 'books',
        relations: {
          'author': { belongsTo: 'author' }
        }
      }
    ]);

    var remoteCouch = false;

    function create() {
      db.rel.save('author', {
        name: 'Stephen King',
        id: 19,
        books: [1]
      }).then(function () {
        return db.rel.save('author', {
          name: 'George R. R. Martin',
          id: 1,
          books: [6, 7]
        });
      }).then(function () {
        return db.rel.save('book', {
          title: 'It',
          id: 1,
          author: 19
        });
      }).then(function () {
        return db.rel.save('book', {
          title: 'A Game of Thrones',
          id: 6,
          author: 1
        });
      }).then(function () {
        return db.rel.save('book', {
          title: 'The Hedge Knight',
          id: 7,
          author: 1
        });
      }).then(function () {
        return db.rel.find('author');
      });
    }

    function show() {
      db.rel.find('author', 1).then(docs => console.log(docs))
    }

    function add() {
      let book = {
        title: newName.value,
        author: 1
      };
      return db.rel.save('book', book);

    }

    function allBooks() {
      db.rel.find('book').then(docs => console.log(docs))
      db.rel.find('author').then(docs => console.log(docs))
      db.allDocs({ include_docs: true }).then(docs => console.log(docs))
    }

    const currentBook = ref(null)

    function findSingleBook() {
      /*
      db.rel.find('book', '9F11A041-880E-47AA-A8D7-DBF51A2B22FB').then(
        res => {
          console.log(res)
          currentBook.value = res.books[0]

        }
      )

      */
      db.find({
        selector:
          { 'data.title': suche.value },
        // { 'data.author': undefined }
      }).then(response => {
        console.log('!!!', response)
        if (response.docs.length > 0) {
          const { type, id } = db.rel.parseDocID(response.docs[0]._id)
          db.get(response.docs[0]._id, { revs_info: true }).then(bla => console.log(bla))
          db.rel.find(type, id).then(res => {
            console.log(res)
            currentBook.value = res.books[0]
            currentBook.value.author = 1
          })
        } else {
          currentBook.value = null
        }
      })

    }

    function modifyBook() {
      db.rel.save('book', currentBook.value).then(x => console.log(x))


    }

    function addAuthor() {
      db.rel.save('author', { name: 'Walter', id: 1 }).then(x => console.log(x))

    }

    function findBooksOfAuthor() {
      db.rel.findHasMany('book', 'author', 1).then(books => console.log(books));
    }

    function showChanges() {
      db.changes({
        limit: 10,
        since: 0,
        include_docs: true,
      }).then(function (result) {
        console.log(result)
        // handle result
      }).catch(function (err) {
        console.log(err);
      });
    }

    return {
      create,
      add,
      newName,
      show,
      allBooks,
      findSingleBook,
      suche,
      modifyBook,
      currentBook,
      showChanges,
      addAuthor,
      findBooksOfAuthor
    }
  }


})
</script>
