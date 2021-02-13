<template>
  <v-app class="px-5 py-5 mt-12 background-main"> 
      <h2>Data parkir</h2>
      <div class="py-5 px-5 mt-3 white">
        <v-row class="mt-2">
          <v-col lg="5" md="5" sm="12">
            <v-text-field
              filled
              rounded
              placeholder="Search ID"
              prepend-inner-icon="mdi-magnify"
              v-model="search"
              single-line
            ></v-text-field>
          </v-col>
          <v-col lg="6" md="6" sm="12">
            <v-form
              style="width: 100% !important"
              ref="form1"
              lazy-validation
              v-model="valid"
              >
              <v-row>
                <v-col lg="6" md="6" sm="12" class="ma-0 pa-0">
                  <v-select
                    :items="items"
                    :rules="bulanRules"
                    label="Bulan"
                    v-model="download.bulan"
                    @change="$refs.form1.validate()"
                    rounded
                    filled
                  ></v-select>
                </v-col>
                <v-col lg="5" md="5" sm="12" class="ml-md-4 my-0 pa-0">
                  <v-select
                    v-model="download.tahun"
                    :items="tahun"
                    :rules="tahunRules"
                    @change="$refs.form1.validate()"
                    label="Tahun"
                    rounded
                    filled
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col lg="1" md="1" sm="12">
            <v-btn rounded small depressed fab color="cyan" dark @click="initialize()">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div class="text-right  mb-3">
          <v-menu 
            offset-y 
            dark
            :close-on-content-click="false"
            v-model="menuDownload">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                dark
                color="primary"
                depressed>
                <v-icon left small>mdi-download</v-icon>
                Download Laporan
              </v-btn>
            </template>
            <v-card >
              <v-list >
                <v-list-item >
                  <v-list-item-avatar color="primary">
                    <v-icon>mdi-file-pdf</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Download Laporan</v-list-item-title>
                    <v-list-item-subtitle>Pilih tanggal awal dan akhir</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-row align="center" justify="center">
                    <v-date-picker
                      v-model="dates"
                      color="primary"
                      range
                    ></v-date-picker>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-row align="center" justify="center">
                    <v-btn
                      color="indigo"
                      elevation="10"
                      class="mr-2"
                      @click="dates = [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]"
                      >
                      Bulan Ini
                    </v-btn>
                    <v-btn
                      color="indigo"
                      elevation="10"
                      @click="dates = [moment().startOf('isoWeek').format('YYYY-MM-DD'), moment().endOf('isoWeek').format('YYYY-MM-DD')]"
                      >
                      Pekan Ini
                    </v-btn>
                  </v-row>
                  <v-row align="center" justify="center" class="mt-2"> 
                    <v-btn
                      depressed
                      @click="dates = []"
                      >
                      <v-icon left small>mdi-reload</v-icon>
                      Reset
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  @click="menuDownload = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="download_laporan(laporan.tahun, laporan.bulan, laporan.pekan)"
                >
                  Download
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
        <v-data-table
          :headers="headers"
          :items="parkir"
          :search="search"
          ref="content"
          sort-by="createdAt"
          sort-desc
          class="elevation-1"
        >
          <template v-slot:[`item.nama`]="{ item }">
            <td v-if="item.siswa != null">{{item.siswa.nama}}</td>
            <td v-else-if="item.guru != null">{{item.guru.nama}}</td>
            <td v-else-if="item.tamu != null">{{item.tamu.nama}}</td>
          </template>
          <template v-slot:[`item.masuk`]="{ item }">
            {{ item.masuk != null? item.masuk.replace(/[T]/g, ' ').slice(0, 19) : item.masuk }}
          </template>
          <template v-slot:[`item.keluar`]="{ item }">
            {{ item.keluar != null? item.keluar.replace(/[TZ]/g, ' ').slice(0, 19) : item.keluar}}
          </template>
          <template v-slot:[`item.visitor_id`]="{ item }">
            <v-btn v-if="item.tamu != null" color="cyan" dark rounded @click="detailsItem(item)">Tamu</v-btn>
            <v-btn v-if="item.guru != null" color="teal" dark rounded @click="detailsItem(item)">Guru</v-btn>
            <v-btn v-if="item.siswa != null" color="purple" dark rounded @click="detailsItem(item)">Siswa</v-btn>
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">
            <v-chip v-if="item.keluar == null" dark color="red">Aktif</v-chip>
            <v-chip v-else dark outlined color="red">Selesai</v-chip>
          </template>
          <template v-slot:[`item.role`]="{ item }">
            <v-chip color="white">{{ item.role == 1 ? "Motor" : "Mobil"}}</v-chip>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize()"> Reset </v-btn>
          </template>
        </v-data-table>
      </div> 
      <v-dialog v-model="dialogDetails" max-width="500">
        <v-card class="pt-5 px-8">
      
          <v-row align="center" justify="center" class="mb-5">
            <v-avatar v-if="this.title == 'Siswa'" size="75" color="purple" ><v-icon size="40" color="white">mdi-school-outline</v-icon></v-avatar>
            <v-avatar v-else-if="this.title == 'Guru'" size="75" color="teal" ><v-icon size="30" color="white">fa fa-chalkboard-teacher</v-icon></v-avatar>
            <v-avatar v-else-if="this.title == 'Tamu'" size="75" color="cyan" ><v-icon size="40" color="white">mdi-help-circle-outline</v-icon></v-avatar>
            <v-chip label style="position: absolute; right: 10px; top: 10px" class="mx-2 my-2">{{ this.title }}</v-chip>
          </v-row>

          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr v-for="(item, index) in detailParkir" :key="item.name">
                  <th >{{ index }}</th>
                  <th >:</th>
                  <th >{{ item }}</th>
                </tr>
              </thead>
            </template>
          </v-simple-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeDetails"
              >Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <!-- <template>
        <div >
          <v-menu offset-y rounded="l" offset-overflow>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                color="orange"
                dark
                fab
                class="mr-3 mb-12"
                bottom
                right
                fixed>
                <v-icon> mdi-arrow-collapse-down </v-icon>
              </v-btn>
            </template>
            <v-card >
              <v-list >
                <v-list-item >
                  <v-list-item-avatar>
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                    >
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>John Leider</v-list-item-title>
                    <v-list-item-subtitle>Founder of Vuetify</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      :class="fav ? 'red--text' : ''"
                      icon
                      @click="fav = !fav"
                    >
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-list-item-action>
                    <v-switch
                      v-model="message"
                      color="purple"
                    ></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Enable messages</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-action>
                    <v-switch
                      v-model="hints"
                      color="purple"
                    ></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Enable hints</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="menu = false"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </template> -->
    <router-view></router-view> 
  </v-app>
</template>

<script>
import ParkirService from "../services/ParkirService";
import jsPDF from 'jspdf';
import moment from 'moment';
import 'jspdf-autotable';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const d = new Date();

export default {
  name: "ParkingData",
  components: {},

  data: () => ({
    snackbar: false,
    menuDownload: false,
    message: '',
    bulanRules: [
      v => !!v || 'Bulan is required',
    ],
    tahunRules: [
      v => !!v || 'Tahun is required',
    ],
    pekanRules: [
      v => !!v || 'Pekan is required',
    ],
    title: '',
    dates: [],
    valid: false,
    detailParkir: [],
    items: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    tahun: [
      2019,
      2020,
      2021
    ],
    
    download: {
      bulan: 0,
      tahun: 0,
    },

    laporan: {
      bulan: monthNames[d.getMonth()],
      tahun: d.getFullYear(),
      pekan: 'All',
    },
      
    IdentitasKendaraan: [
      
    ],

    start_date: null,
    end_date: null,

    search: '',

    dialogDetails: false,
    dialogLaporan: false,
    parkir: [],
    laporanParkir: [],
  }),

  computed: {
    headers () {
      return [
        { text: "Id", align: "start", value: "id" },
        {
          text: "Nama",
          sortable: true,
          value: "nama",
          filterable: false
        },
        { text: "Detail", value: "visitor_id", align:"center", filterable: false},
        { text: "Jenis", align: "center", value: "role", filterable: false},
        { 
          text: "Tanggal Masuk", 
          value: "masuk", 
          sortable: true, 
          filter: value => {
            if (!this.download.bulan && !this.download.tahun) return true

            var from = new Date(this.download.tahun, this.items.indexOf(this.download.bulan), 1).setHours(7)
            var to = new Date(this.download.tahun, this.items.indexOf(this.download.bulan) + 1, 1).setHours(7)

            return new Date(value) >= from && new Date(value) <= to
          } 
        },
        { text: "Tanggal Keluar", value: "keluar", sortable: true, filterable: false },
        { text: "Status", align: "center", value: "createdAt" , sortable: false, filterable: false},
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? "Tambah parkir" : "Edit Data parkir";
    },
  },

  watch: {
    dialogDetails(val) {
      val || this.closeDetails();
    },
  },

  mounted() {

    var m = moment()
    console.log(m.startOf('isoWeek').week(2).format('YYYY-MM-DD'))
    console.log(m.clone().endOf('isoWeek').format('YYYY-MM-DD'))
    
    ParkirService.getAll()
      .then((res) => {
        this.parkir = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

  },

  sockets: {
    newParkir: function () {
      ParkirService.getAll()
        .then((res) => {
          this.parkir = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    exitParkir: function () {
      ParkirService.getAll()
        .then((res) => {
          this.parkir = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  methods: {
    initialize() {
      this.download.bulan = 0
      this.download.tahun = 0
      this.search = ''

      this.$refs.form1.resetValidation()
    },
    getColor(status) {
      if (status == "Selesai") return "green";
      else if (status == "Aktif") return "blue";
    },
    closeDetails() {
      this.dialogDetails = false
    },
    detailsItem(item) {
      this.editedIndex = this.parkir.indexOf(item);

      if (item.siswa != null) {
        this.title = "Siswa"
        this.detailParkir = item.siswa;
      }
      else if (item.guru != null) {
        this.title = "Guru"
        this.detailParkir = item.guru;
      }
      else if (item.tamu != null){
        this.title = "Tamu"
        this.detailParkir = item.tamu;
      } 

      this.dialogDetails = true;
    },
    
    filterData(bulan, tahun) {
      if(this.$refs.form1.validate()) {
        var from = new Date(tahun, this.items.indexOf(bulan), 1).setHours(7)
        var to = new Date(tahun, this.items.indexOf(bulan) + 1, 1).setHours(7)
  
        ParkirService.laporan(from, to)
          .then(res => {
            this.parkir = res.data.data;
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    download_laporan() {

      if(this.dates.length > 1){
        var from, to
        if(this.dates[0] > this.dates[1]) {
          from = this.dates[1]
          to = this.dates[0]
        } else {
          from = this.dates[0]
          to = this.dates[1]
        }
        
        ParkirService.laporan(from, to)
          .then(res => {
            this.laporanParkir = res.data.data;
            
            if(typeof this.laporanParkir !== 'undefined' && this.laporanParkir.length > 0) {
              
              // var source =  this.$refs["content"];
              let rows = [];
              let columnHeader = ['ID', 'Jenis', 'Nama', 'Role', 'Tgl Masuk', 'Jam Masuk', 'Tgl Keluar', 'Jam Keluar', 'Status'];
              let pdfName = 'LAPORAN_PARKIR_'+from+"_SD_"+to
              var tamu = 0
              var guru = 0
              var siswa = 0
    
              this.laporanParkir.forEach(element => {
                var temp = []
                if(element.siswa != null) {
                  siswa++
                  temp = [
                    element.id,
                    element.role == 1? 'Motor' : 'Mobil',
                    element.siswa.nama,
                    'Siswa',
                    element.masuk != null? element.masuk.replace(/[T]/g, ' ').slice(0, 11) : element.masuk,
                    element.masuk != null? element.masuk.replace(/[T]/g, ' ').slice(10, 19) : element.masuk,
                    element.keluar != null? element.keluar.replace(/[T]/g, ' ').slice(0, 11) : element.keluar,
                    element.keluar != null? element.keluar.replace(/[T]/g, ' ').slice(10, 19) : element.keluar,
                    element.keluar == null? 'Aktif' : 'Selesai'
                  ];
                } else if(element.guru != null) {
                  guru++
                  temp = [
                    element.id,
                    element.role == 1? 'Motor' : 'Mobil',
                    element.guru.nama,
                    'Guru',
                    element.masuk != null? element.masuk.replace(/[T]/g, ' ').slice(0, 11) : element.masuk,
                    element.masuk != null? element.masuk.replace(/[T]/g, ' ').slice(10, 19) : element.masuk,
                    element.keluar != null? element.keluar.replace(/[T]/g, ' ').slice(0, 11) : element.keluar,
                    element.keluar != null? element.keluar.replace(/[T]/g, ' ').slice(10, 19) : element.keluar,
                    element.keluar == null? 'Aktif' : 'Selesai'
                  ];
                } else if(element.tamu != null) {
                  tamu++
                  temp = [
                    element.id,
                    element.tamu == 1? 'Motor' : 'Mobil',
                    element.tamu.nama,
                    'Tamu',
                    element.masuk != null? element.masuk.replace(/[T]/g, ' ').slice(0, 11) : element.masuk,
                    element.masuk != null? element.masuk.replace(/[T]/g, ' ').slice(10, 19) : element.masuk,
                    element.keluar != null? element.keluar.replace(/[T]/g, ' ').slice(0, 11) : element.keluar,
                    element.keluar != null? element.keluar.replace(/[T]/g, ' ').slice(10, 19) : element.keluar,
                    element.keluar == null? 'Aktif' : 'Selesai'
                  ];
                }
                rows.push(temp);
              });
    
              var doc = new jsPDF();
              doc.text(15, 20, 'LAPORAN PARKIR')
              doc.setFontSize(9);
              doc.text(15, 25, from + ' s/d ' +to)
    
              doc.autoTable(columnHeader, rows, { startY: 35 });
    
              doc.text(15, doc.autoTable.previous.finalY + 10, 'Jumlah : ' + this.laporanParkir.length)
              doc.text(15, doc.autoTable.previous.finalY + 15, 'Guru : ' + guru)
              doc.text(15, doc.autoTable.previous.finalY + 20, 'Siswa : ' + siswa)
              doc.text(15, doc.autoTable.previous.finalY + 25, 'Tamu : ' + tamu)
    
              var date = new Date();
              doc.text(140, doc.autoTable.previous.finalY + 10, 'Tanggal Download : ' +date.getDate()+' '+monthNames[date.getMonth()]+' '+date.getFullYear())
    
              doc.text(140, doc.autoTable.previous.finalY + 20, 'ID Admin : ' + this.$session.get('id'))
              doc.text(140, doc.autoTable.previous.finalY + 25, 'Nama Admin : ' + this.$session.get('name'))
              doc.save(pdfName + '.pdf');
    
    
              this.message = 'Berhasil Mendownload'
              this.snackbar = true
            } else {
              this.message = 'Data Kosong'
              this.snackbar = true
            }
          })
          .catch(err => {
            console.log(err)
          })

      } else {
        this.message = 'Pilih Tanggal Mulai dan Akhir Terlebih Dahulu'
        this.snackbar = true
      }
    },
    
  },
  
};
</script>
