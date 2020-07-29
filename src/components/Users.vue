<template>
   <div>
      <Loader v-if="isLoading" />
      <div v-else class="mainBlock">
         <table>
            <thead>
               <tr>
                  <th class="colIndex"></th>
                  <th class="col">Fio</th>
                  <th class="col">Birthdate</th>
                  <th class="col">Phone</th>
               </tr>
            </thead>

            <tbody v-for="(row, index) in rows" :key="row.id">
               <tr>
                  <td class="colIndex">{{ index + 1 }}</td>
                  <td class="col">
                     <div>
                        <input
                           v-if="rowEditId == `${row.id}-${row.birthDate}` && !isCreatingNewRow"
                           :id="`${row.id}-fio`"
                           type="text"
                           v-model="row.fio"
                           maxlength="50"
                           @blur="cancelEdit()"
                           @keydown.esc="cancelEdit()"
                           @keydown.enter="saveEdited(row)"
                        />
                        <div class="empty" v-else @click="setToEdit_r(row)">
                           {{ row.fio }}
                        </div>
                     </div>
                  </td>
                  <td class="col">
                     <div>
                        <input
                           v-if="rowEditId == `${row.id}-${row.phone}` && !isCreatingNewRow"
                           :id="`${row.id}-birthdate`"
                           type="date"
                           v-model="row.birthDate"
                           @blur="cancelEdit()"
                           @keydown.esc="cancelEdit()"
                           @keydown.enter="saveEdited(row)"
                        />
                        <div v-else @click="setToEdit_b(row)">
                           {{ row.birthDate | formatDate }}
                        </div>
                     </div>
                  </td>
                  <td class="col">
                     <div>
                        <input
                           v-if="rowEditId == `${row.id}-${row.fio}` && !isCreatingNewRow"
                           :id="`${row.id}-phone`"
                           type="text"
                           v-model="row.phone"
                           maxlength="10"
                           @blur="cancelEdit()"
                           @keydown.esc="cancelEdit()"
                           @keydown.enter="saveEdited(row)"
                        />
                        <div v-else @click="setToEdit_p(row)">
                           {{ row.phone | formatProne }}
                        </div>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>

         <div>
            <div v-if="!isCreatingNewRow">
               <button class="btn" @click="startNewRow()">Add row</button>
            </div>
            <div v-else>
               <form @keydown.esc="cancelNewRow()">
                  <table>
                     <tr>
                        <td class="colIndex"></td>
                        <td class="col">
                           <input type="text" v-model="newFio" required />
                        </td>
                        <td class="col">
                           <input type="date" v-model="newBirthDate" required />
                        </td>
                        <td class="col">
                           <input title="format: 10 digits" type="text" maxlength="10" pattern="[0-9]*" v-model="newPhone" required />
                        </td>
                     </tr>
                  </table>

                  <button class="btn" @click="saveNewRow()">Save new row</button>
               </form>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import Loader from '@/components/Loader'
import { sendRequestXHR } from '@/helpers'
import { apiEditUser } from '@/urls'
import { apiCreateUser } from '@/urls'
import { apiUsers } from '@/urls'

export default {
   data() {
      return {
         rows: [],
         rowEditId: '',
         newFio: '',
         newBirthDate: '',
         newPhone: '',
         isCreatingNewRow: false,
         isLoading: true,
      }
   },
   methods: {
      setToEdit_r(row) {
         this.rowEditId = `${row.id}-${row.birthDate}`
         setTimeout(() => document.getElementById(`${row.id}-fio`).focus(), 1)
      },
      setToEdit_b(row) {
         this.rowEditId = `${row.id}-${row.phone}`
         setTimeout(() => document.getElementById(`${row.id}-birthdate`).focus(), 1)
      },
      setToEdit_p(row) {
         this.rowEditId = `${row.id}-${row.fio}`
         setTimeout(() => document.getElementById(`${row.id}-phone`).focus(), 1)
      },
      startNewRow() {
         this.isCreatingNewRow = true
      },
      cancelNewRow() {
         this.isCreatingNewRow = false
      },
      saveNewRow() {
         const body = new Row(this.newFio, this.newBirthDate, this.newPhone)
         sendRequestXHR('POST', apiCreateUser, body, this)
         this.isCreatingNewRow = false
      },
      saveEdited(row) {
         sendRequestXHR('POST', apiEditUser, row, this)
         this.rowEditId = ''
      },
      cancelEdit() {
         this.rowEditId = ''
      },
   },
   filters: {
      formatDate(value) {
         const date = new Date(value)
         return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
      },
      formatProne(value) {
         return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`
      },
   },
   components: {
      Loader,
   },
   mounted() {
      sendRequestXHR('GET', apiUsers).then(data => {
         this.rows = data
         this.isLoading = false
      })
   },
}

class Row {
   constructor(fio, birthdate, phone) {
      this.FIO = fio
      this.BirthDate = birthdate
      this.Phone = phone
   }
}
</script>

<style scoped>
.mainBlock {
   width: max-content;
   margin: auto;
   justify-content: center;
   align-items: center;
   display: grid;
}

.colIndex {
   border-bottom: 1px solid #ddd;
   width: 15px;
   text-align: center;
   font-weight: bold;
}

.col {
   width: 300px;
   max-width: 300px;
   height: 50px;
   text-align: center;
   vertical-align: middle;
   border-bottom: 1px solid #ddd;
   word-wrap: break-word;
}

.empty {
   margin-bottom: -32767px;
   padding-bottom: 32767px;
}

tr:hover {
   background-color: #f5f5f5;
   z-index: 100;
}

td:focus {
   border: 1px dotted black;
   z-index: 100;
}

input {
   font-size: 16px;
   font-family: 'Times New Roman';
   width: 95%;
   height: 40px;
   text-align: center;
   vertical-align: middle;

   background: transparent;
   border-top: none;
   border-left: none;
   border-right: none;
   border-bottom: 1px solid lightseagreen;
}

.btn {
   border-radius: 10%;
   background: rgb(48, 235, 172);
   padding: 5px;
   margin: 10px;
   float: right;
}
</style>
