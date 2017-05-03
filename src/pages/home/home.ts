import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, PopoverController, AlertController, ModalController } from 'ionic-angular';

import { MoreMenuPage } from '../moremenu/moremenu';
import { HighscoresPage } from '../highscores/highscores';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl : ModalController, public nativeStorage: NativeStorage) { 
    
  }
  
  
  
  @ViewChild('up') upElement: ElementRef;
  @ViewChild('down') downElement: ElementRef;
  @ViewChild('maincontent') mainContentElement: ElementRef;
  @ViewChild('oparea') opAreaElement: ElementRef;
  
  
  gameover = false;
  newLevel = -1;
  highscores = { };
  loseTimeOut = null;
  startLevelTimeout = null;
  gameLevel = 3;
  opCount = 0;
  ops = [];
  score = 0;
  playing = false;
  upOp = "";
  downOp = "";
  playerName = "";

  ionViewDidLoad()
  {
	  
	 this.upElement.nativeElement.addEventListener("animationend", function() {  this.upElement.nativeElement._onAnimationEnd();  }.bind(this));
	 this.downElement.nativeElement.addEventListener("animationend", function() {  this.downElement.nativeElement._onAnimationEnd();  }.bind(this));
	  
	 this.retrieveHighscores();
	 this.reset();
  }
  
  getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  openMenu(ev){
	 
	 this.gameover = true;
	 clearTimeout(this.startLevelTimeout);
	 clearTimeout(this.loseTimeOut);
	 let popover = this.popoverCtrl.create(MoreMenuPage, { 
		gameLevel: this.gameLevel,
		setGameLevel: this.setGameLevel.bind(this),
        openHighscoresPage: this.openHighscoresPage.bind(this),
        setTheme: this.setTheme.bind(this)		
	 });
     popover.present({
      ev: ev
     });
	 
	 popover.onDidDismiss((popoverData) => {
		
		this.lose();
    });
	 
  }
  
  openHighscoresPage() {
	  
	  let modal = this.modalCtrl.create(HighscoresPage, { highscores: this.highscores });
      modal.present();
  } 
  
  setGameLevel(level)
  {
	  this.newLevel = level;
  }
  
  setTheme(theme)
  {
	  
	  this.mainContentElement["_elementRef"].nativeElement.style.backgroundColor = theme;
	  this.opAreaElement.nativeElement.style.backgroundColor = theme;
	  
	  this.opAreaElement.nativeElement.style.color = (theme == "white" || theme == "tan") ? "" : "white";
	  
  }
  
  startLevel(level, wait) {
		this.playing = false;
		if (level >= 0) {
			
			if(wait)
			{
				this.startLevelTimeout = setTimeout(function () {
					this.pushOp(function () { this.startLevel(level - 1, true); }.bind(this));
				}.bind(this), 1000);
			}
			else
				this.pushOp(function () { this.startLevel(level - 1, true); }.bind(this));
		}
		else { this.playing = true; }
   }

   pushOp(callback) {
		
		if(this.gameover) return;
		clearTimeout(this.loseTimeOut);
		
		this.loseTimeOut = setTimeout(function() {
		     this.lose();
		}.bind(this), 5000);
		
		this.opCount ++;
		//this.playing = false;
		var op = { result: this.getRandomInt(0, 9), op: "" };
		if (this.getRandomInt(0, 1)) //Suma
		{
			var firstNum = this.getRandomInt(0, op.result);
			var secondNum = op.result - firstNum;
			var pos = this.getRandomInt(0, 1);

			op.op = (pos ? firstNum : secondNum) + " + " +
				(pos ? secondNum : firstNum);
		}
		else   //Resta
		{
			var firstNum = this.getRandomInt(op.result, 9);
			var secondNum = firstNum - op.result;

			op.op = firstNum + " - " + secondNum;
		}

		this.ops.unshift(op);

		
		this.upOp = op.op;
		this.upElement.nativeElement.className = "anim-upgodown";
		

		this.upElement.nativeElement._onAnimationEnd = function() {
			  this.upElement.nativeElement.className = "";
		}.bind(this);
		
        this.downElement.nativeElement.className = "anim-downgodown";
		
		
		this.downElement.nativeElement._onAnimationEnd = function() {
		  this.downOp = op.op;
		
		  this.downElement.nativeElement.className = "";
		  if (callback) callback();
		}.bind(this);
		  

	}

	isHighscore()
	{
		 if(this.score == 0)
			 return -1;
		
		
		 for(var i=0; i < this.highscores[this.gameLevel].length; i++)
		 {
			 if(this.score >= this.highscores[this.gameLevel][i].score)
			 {
				 return i;
			 }
		 }
		 return -1;
	}
	
	saveHighscore()
	{
		var index = this.isHighscore();
		if(index > -1)
		{
			
			this.highscores[this.gameLevel].splice(index, 0, { score: this.score, name: this.playerName });
			this.highscores[this.gameLevel].splice(10,1);
		}
				
		
		this.nativeStorage.setItem('highscores', this.highscores)
		  .then(
			data => { this.highscores = data },
			error => console.error(error)
		  );
		
	}
	
	fixHighscores()
	{
		for(var i=2; i <= 7; i++)
		{
			this.highscores[i] = this.highscores[i] || [];
			while(this.highscores[i].length < 10)
			{
				this.highscores[i].push({ name: "", score: 0 });
			}
		}
	}
	
	retrieveHighscores(){
		
		this.nativeStorage.getItem('highscores')
		  .then(
			data => { this.highscores = data;
		
				this.highscores = this.highscores || {};
                this.fixHighscores();	
			},
			error => {
				
				this.highscores = {};
				this.fixHighscores();
			}
		  );
	}
	
	reset() {
		
		if(this.newLevel != -1)
		{
			this.gameLevel = this.newLevel;
			this.newLevel = -1;
		}
		
		this.gameover = false;
	    this.opCount = 0;
		this.playing = false;
		this.score = 0;
		this.upOp = "";
		this.downOp = "";
		this.ops = [];
		this.startLevel(this.gameLevel, false);
	}
	
	lose(){
	
		clearTimeout(this.loseTimeOut);
		this.gameover = true;
		this.playing = false;
		
		if(this.isHighscore() > -1)
		{
			
			var prompt = this.alertCtrl.create({
				  enableBackdropDismiss: false,
				  title: 'New record!',
				  message: "Your score: " + this.score + ". Please enter your name below",
				  inputs: [
					{
					  name: 'name',
					  placeholder: 'Name',
					  value: this.playerName
					},
				  ],
				  buttons: [
					{
					  text: 'Save and try again',
					  handler: data => {
						
							this.playerName = data.name;
							this.saveHighscore();
							this.reset();
					  }
					}
				  ]
				});
				
				prompt.present();
			
		}
		else if(this.newLevel == -1)
		{
			let alert = this.alertCtrl.create({
			  enableBackdropDismiss: false,
			  title: 'You lost!',
			  subTitle: 'Your score: ' + this.score,
			  buttons: [
					{
					  text: 'Try again',
					  handler: data => {
						
						this.reset();
						
					  }
					}
				  ]
			});
			alert.present();
			
		}
		else
			this.reset();
	}

	numPressed(num) {
		if (!this.playing)
			return;

		var a = this.ops.pop();
		if (num != a.result) {
			
			this.lose();
		}
		else {
			this.score++;
			this.pushOp(null);
		}
	}

}
