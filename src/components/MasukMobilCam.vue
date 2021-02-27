<template >
  <v-container fill-height fluid >
    <v-row align="center" justify="center">
      <v-btn color="transparent" elevation="0" class="mr-5">
        <v-icon>mdi-setting</v-icon>
      </v-btn>
      <v-card color="basil" width="625" elevation="20" class="py-5" >
        <v-card-title class="mb-5 mx-5">
          <v-avatar color="primary" class="mr-5">
            <v-icon dark >mdi-parking</v-icon>
          </v-avatar>
          <h2>Scan Your Barcode!</h2></v-card-title>
          <v-tabs
            v-model="tab"
            background-color=""
            color="primary"
            grow
          >
            <v-tab
              v-for="item in items"
              :key="item"
              @click="roleChange(item)"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
          <StreamBarcodeReader 
            @decode="onDecode"
            @loaded="onLoaded"
          ></StreamBarcodeReader>
      </v-card>
      
      <v-dialog
        v-model="modal"
        scrollable="false"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            color="orange" 
            dark 
            class="ml-5 rounded-lg mt-5" 
            v-bind="attrs"
            v-on="on"
            large 
            depressed>
            <v-icon >mdi-cog</v-icon>
          </v-btn>
        </template>
        <template  v-slot:default>
          <v-form class="rounded-lg white pa-5 ml-5">
            <v-select 
              :items="cameras" 
              v-model="selectedCamera"
              item-text="label"
              item-value="deviceId"
              bottom
              autocomplete
              @change="onCamChange(selectedCamera)"
              label="input device">

            </v-select>
          </v-form>
        </template>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import ParkirService from "../services/ParkirService"

export default {
  name: 'MasukMobilCam',

  components: {    
    StreamBarcodeReader
  },

  data: () => ({
    jenis: 1,
    isPaused: false,
    tab: null,
    modal: false,
    items: [
      'Motor', 'Mobil'
    ],
    devices: null,
    cameras: [],
    selectedCamera: null
  }),

  async created() {
    navigator.mediaDevices.getUserMedia({audio: false, video: true});   
    await navigator.mediaDevices.enumerateDevices().then(devices => {
      this.devices = JSON.parse(JSON.stringify(devices))
    })

    this.devices.forEach(element => {
      if(element.kind == "videoinput") {
        this.cameras.push(element) 
      }
    });

    this.selectedCamera = this.cameras[0].deviceId
    this.onCamChange(this.cameras[0].deviceId)
  },

  methods: {    
    onDecode(id) {
      if(!this.isPaused) {
        this.isPaused = true
        ParkirService.masuk(id, this.jenis)
          .then(response => {
            console.log(response.data.messages)          
            this.$swal({
              title: response.data.messages,
              text: 'Silahkan Masuk',
              icon: 'success',  
              showConfirmButton: false,
              timer: 1500               
            })
          })      
          .catch(err => {
            console.log(err.response.data.messages)                  
            this.$swal({
              title: err.response.data.messages,
              text: 'Anda Tidak Diizinkan Masuk',
              icon: 'error',                    
              showConfirmButton: false,
              timer: 1500
            })
          })
        
        setTimeout(() => {
          this.isPaused = false
        }, 2500)
  
      }
    },
    onLoaded() {
      console.log("loaded")
    },   

    roleChange(role) {
      role == 'Motor'? this.jenis = 1 : this.jenis = 2
    },

    onCamChange(deviceId){
      navigator.mediaDevices.getUserMedia({
         video: {deviceId: deviceId ? {exact: deviceId} : undefined}
      }).then(function(stream) {
        document.querySelector('video').srcObject = stream
      })
    }
  }
}
</script>