import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Router, NavigationStart, Event,ActivatedRoute } from '@angular/router';
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
  id:any
  row_data = []
  datess=[]

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
    private activeRoute: ActivatedRoute,
    private location:Location
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
    this.id = this.activeRoute.snapshot.paramMap.get('id')
    this.getdata(this.id)
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


  getdata(id){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('location', id)
    this.http.post("https://cureplus.online/APIs/locationsearch.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      var l=0
        var json=JSON.parse(JSON.stringify(res))
        console.log(json)
        for(var i=0; i<json.length;i++){
          //console.log(json[0])
          l++
          this.row_data.push({
            dataid:'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            type:json[i].type,
            id:json[i].id,
            count:Number(json[i].maxlimit),
            status:json[i].status,
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
  view_full(id,type,actualid){
    //alert(id)
    var dates = ((document.getElementById(actualid) as HTMLInputElement).value);
    if(type=='Doctor'){
      this.router.navigateByUrl('/doctorprofile/'+id+'/'+dates);
    }
    if(type=='Hospital'){
      this.router.navigateByUrl('/allprofiles/'+id+'/hospital/'+dates);
    }
    if(type=='Clinic'){
      this.router.navigateByUrl('/allprofiles/'+id+'/clinic/'+dates);
    }
    if(type=='Diagnostic'){
      this.router.navigateByUrl('/allprofiles/'+id+'/diag/'+dates);
    }
  }
  goBack(){
    this.location.back();
  }

}
