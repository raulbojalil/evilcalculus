
import { NavController, ViewController,NavParams } from 'ionic-angular';
import { Component } from '@angular/core';



@Component({
	
  templateUrl: 'moremenu.html'
  
})
export class MoreMenuPage {
 
  gameLevel = 3;
  theme = "white";
  setGameLevel = null;
  setTheme = null;
  onClosed = null;
  openHighscoresPage = null;
 
  constructor(public navCtrl : NavController, public viewCtrl: ViewController, public navParams: NavParams) {
		
	  this.gameLevel = navParams.data.gameLevel;
	  this.setGameLevel = navParams.data.setGameLevel;
	  this.openHighscoresPage = navParams.data.openHighscoresPage;
	  this.setTheme = navParams.data.setTheme;
  }
 
  close() {
    this.viewCtrl.dismiss();
  }
  
  showHighscores() {
	  
	  this.openHighscoresPage();
  }
  
  changeGameLevel(ev){
	  
	  this.setGameLevel(this.gameLevel);
	  this.close();
  }
  
  changeTheme(theme){
	  
	  this.theme = theme;
	  this.setTheme(theme);
	  
  }
  
}
