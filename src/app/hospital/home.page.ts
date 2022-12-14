import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController,AlertController  } from '@ionic/angular';
import { Router, NavigationStart, Event } from '@angular/router';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { InteractionService } from '../_services/interaction.service';
import { HomeDataService } from './home-data.service';
import { HttpClient } from '@angular/common/http';
import { Location } from "@angular/common";
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 
  darkMode: boolean;
  showPrivacyBanner = true;
  showReminder: boolean;
  datess=[]
  row_data = []
  offlinedata=[]
  jsonData=[]
  alert: any;
  isOrange=false
  constructor(
    private title: Title,
    private interact: InteractionService,
    private modal: ModalController,
    private toast: ToastController,
    private store: Storage,
    private nav: NavController,
    private router: Router,
    private homeData: HomeDataService,
    private http: HttpClient,
    private location:Location,
    private alertController :AlertController 
  ) { }

  ngOnInit() {
    var someDate = new Date();
    var dd = someDate.getDate();
    var mm = someDate.getMonth();
    var y = someDate.getFullYear();
    var someFormattedDate = dd + '-'+ mm + '-'+ y;
    this.datess.push(someFormattedDate)
    var dd1 = someDate.getDate()+1;
    var mm1 = someDate.getMonth();
    var y1 = someDate.getFullYear();
    var someFormattedDat1 = dd1 + '-'+ mm1 + '-'+ y1;
    this.datess.push(someFormattedDat1)
    var dd2 = someDate.getDate()+2;
    var mm2 = someDate.getMonth();
    var y2 = someDate.getFullYear();
    var someFormattedDate2 = dd2 + '-'+ mm2 + '-'+ y2;
    this.datess.push(someFormattedDate2)
    this.getdata()
    this.geofflinetdata()
    this.title.setTitle('Doctor Dashboard');
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
       //this.hideModal();
      }
    })
  }

  ionViewDidEnter() {
    this.store.get('DARK_UI').then((mode) => this.darkMode = mode ? true : false);
    this.store.get('BANN_PRIVACY').then((show) => this.showPrivacyBanner = show !== 'N' ? true : false);
  }

  toggle(){
    if(this.isOrange) {
      this.presentToast('Sort by Name A to Z')
      this.getdata()
     
    }else {
      this.presentToast('Sort by Name Z to A')
       this.getdatadesc()
       
    }
    this.isOrange = !this.isOrange;
  }

  getdata(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/allhospital.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      var l=0
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          //console.log(json[0])
          this.row_data.push({
            dataid: 'dates',
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
    });
  }
  getdatadesc(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/allhospitaldsc0.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      var l=0
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          //console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
    });
  }

  geofflinetdata(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/allhospitaloffline.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.offlinedata=[]
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          //console.log(json[0])
          this.offlinedata.push({
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
    });
  }

 

  changeUIMode(e) {
    if (e.detail.checked) {
      this.store.set('DARK_UI', true)
        .then(_ => {
          this.interact.setDarkMode(true);
        });
    } else {
      this.store.set('DARK_UI', false)
        .then(_ => {
          this.interact.setDarkMode(false);
        });
    }
  }

  hideBanner() {
    this.showPrivacyBanner = false;
    this.store.set('BANN_PRIVACY', 'N');
  }

  

  
  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }


  doRefresh(e) {
  }

  goToProfile() {
    this.hideBanner();
    this.nav.navigateForward('/account/my-profile');
  }
  view_full(id,anotherid){
    //var dates = ((document.getElementById(anotherid) as HTMLInputElement).value);
   
    // if(dates){
      this.router.navigateByUrl('/allprofiles/'+id+'/hospital/'+0);
    // }
    // else{
    //   this.presentToast('Please Select a Date for appointment')
    // }
    //alert(id)
    //"/doctorprofile/
  }
  goBack(){
    this.location.back();
  }

  // dismissReminder() {
  //   this.showReminder = false;
  // }
  async aaaaaa(){
    console.log('hi')
    
  }
  async filter() {
    var tttt
    fetch('https://cureplus.online/APIs/filter.php').then(res => res.json())
    .then(async json => {
      //console.log(json)
      this.alert = await this.alertController.create({
        cssClass: 'radio-alert',
        header: 'Select Filter',
        
        inputs: [
          {
            name: 'Search',
            placeholder: 'Search here',
            type: 'text', 
            id: 'search'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data: any) => {
              //this.filterdata(data)
            }
          }
        ]
      });
  
      await this.alert.present(); 
     // this.updateAlertMessage(json);

    
    });
   
   
  }
  filterdata(){
    var search2 = ((document.getElementById("search") as HTMLInputElement).value);

    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('data', search2)
    this.http.post("https://cureplus.online/APIs/filterdata.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      var l=0
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          //console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
    });
  }
  // updateAlertMessage(json) {
  //   setTimeout(() => {
    
  //   // ionic 4
  //     for(let i=0;i<this.jsonData.length;i++)
  //     {
  //       this.alert.inputs = 'This the updated Alert Message';
  //       }, 3000);
  // }





//   async presentAlert() {
//   this.jsonData=[
//     {"id":1,"label":"saw","name":"Prithivi"},
//     {"id":2,"label":"saw1","name":"Abimanyu"},
//     {"id":3,"label":"saw2","name":"malliga"},
//    ];
//    const alert = await this.alertController.create();

//    alert.header("Low battery");

//   for(let i=0;i<this.jsonData.length;i++)
// {
//  alert.addInput({type: 'radio', label: this.jsonData[i]['label'], value: this.jsonData[i]['name'], });
// }
// alert.addButton({text:'ok',handler: (data:string) => {
//             console.log('OK clicked: '+data );

//           }});

//  await alert.present();

// }
  




  

}
