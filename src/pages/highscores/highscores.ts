
import { NavController, ViewController,NavParams } from 'ionic-angular';
import { Component } from '@angular/core';


@Component({
	
  templateUrl: 'highscores.html'
  
})
export class HighscoresPage {

  highscores = {};
  level = "2";
  constructor(public navCtrl : NavController, public viewCtrl: ViewController, public navParams: NavParams) {
		
	 this.highscores = navParams.data.highscores;
  }
 
  padLeft(num, n){
	 return Array(n-String(num).length+1).join('0')+num;
  }
  
  dismiss()
  {
	  this.viewCtrl.dismiss();
  }
 
}
