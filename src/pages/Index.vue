<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-if="!modoEdicion"
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Guardar task',
          icon: 'save',
          label: 'Guardar',
          handler: saveWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['save']
      ]"
    />

    <q-editor v-else
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Actualizar nota',
          icon: 'save',
          label: 'Actualizar',
          handler: updateWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['save']
      ]"
    />

    <q-card class="row"
     flat bordered v-for="(item,index) in tasks" :key="index">
      <q-card-section :class="item.estado ? 'tachar':''" class="col" v-html="item.texto" />
      <q-btn flat color="blue" @click="item.estado = !item.estado">Acción</q-btn>
      <q-btn flat color="red" @click="editar(index, item.id)">Editar</q-btn>
      <q-btn flat color="red" @click="eliminar(index, item.id)">Eliminar</q-btn>
    </q-card>

    <div class="flex flex-center" v-if="tasks.length==0">
      <h6>Sin notas</h6>
    </div>
  </div>
</template>

<script>
import { db } from 'boot/firebase';
export default {
  data() {
    return {
      editor:'',
      tasks: [],
      index: null,
      modoEdicion: false,
      id: null
    }
  },
  created: function () {
    this.listarTareas();
  },
  methods:{
        async updateWork()
        {
          try {
            const resDB = db.collection('tareas').doc(this.id).update({
              texto: this.editor
            })
            this.tasks[this.index].texto = this.editor;

            this.$q.notify({
              message: 'Tarea actualizada',
              color: 'dark',
              textColor: 'white',
              icon: 'cloud_done'
            })
          } catch (error) {
            console.log(error)
          }finally{
            this.modoEdicion = false;
            this.index = null;
            this.id = null;
            this.editor = '';
          }
          console.log('editr');
        },
        editar(index,id){
          this.modoEdicion = true;
          this.index = index;
          this.id = id;
          this.editor = this.tasks[index].texto;
        },
        async listarTareas(){
          try {
            const resDB = await db.collection('tareas').get()
            
            resDB.forEach(res =>{
              console.log(res);

              const tarea = {
                id: res.id,
                texto: res.data().texto,
                estado: res.data().estado
              }
              this.tasks.push(tarea)
            })

          } catch (error) {
            console.log(error);
          }
        },
        async saveWork () {

          try {
            const resDB = await db.collection('tareas').add({
              texto: this.editor,
              estado: false
            })

            this.tasks.push({
              id: resDB.id,
              texto: this.editor,
              estado: false
            })

            this.editor = '';

            this.$q.notify({
              message: 'Tarea guardada',
              color: 'green-8',
              textColor: 'white',
              icon: 'cloud_done'
            })
            
          } catch (error) {
            console.log(error)
          }
        },
        eliminar(index, id){
          this.$q.dialog({
            title: 'Acción peligrosa',
            message: 'Realmente quieres cancelar la Task?',
            cancel: true,
            persistent: true
          }).onOk( async () => {
            try {
              await db.collection('tareas').doc(id).delete()
              this.tasks.splice(index,1);
            } catch (error) {
              console.log(error)
            }

          })
        }
  }
}
</script>

<style>
.tachar{
  text-decoration: line-through;
}
</style>
