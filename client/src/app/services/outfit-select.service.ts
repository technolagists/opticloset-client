import { Injectable, Output, EventEmitter } from '@angular/core';
import { mockCloset } from './mockClosetData.js';
import { ApiService } from '../services/api/api.service';


@Injectable({
  providedIn: 'root'
})
export class OutfitSelectService {
  outfit: any;
  closet: any;
  selectedItem: any;

  tops: any;
  bottoms: any;
  outerwears: any;
  onePieces: any;
  accessories: any;
  shoes: any;
  
  constructor(public apiService: ApiService) {}

  // retrieve closet from DB using apiService
  getClosetFromDB(cb) {
    this.apiService.getCloset(cb);
  }

  // to save outfit from tab1
  saveOutfit(outfit) {
    this.outfit = outfit;
  }

  // update the outfit of the day with an item from modal
  set(category, item) {
    this.outfit[category] = item;
  }

  // save initial value of a collection on the service
  save(prop, value) {
    this[prop] = value;
  }

  // returns the value of a collection on the service
  get(prop) {
    return this[prop];
  }

  // replace a collection by a single item
  change(prop, item) {
    this[prop].unshift(item);
    this[prop].splice(1, this[prop].length);
  }

  // function to update either closet or sortetCloset on outfitSelect service from components
  restore(prop, array) {
    this[prop].splice(0, this[prop].length);
    array.forEach(item => {
      this[prop].push(item);
    });
  }

  // return the current outfit of the day
  getOutfit() {
    return this.outfit;
  }

  setMock() {
    this.closet = mockCloset;
    this.tops = this.closet.filter((clothing) => clothing['id_category'] === 1 || clothing['id_category'] === 2);
    this.onePieces = this.closet.filter((clothing) => clothing['id_category'] === 3);
    this.outerwears = this.closet.filter((clothing) => clothing['id_category'] === 4);
    this.accessories = this.closet.filter((clothing) => clothing['id_category'] === 5);
    this.bottoms = this.closet.filter((clothing) => clothing['id_category'] === 6);
    this.shoes = this.closet.filter((clothing) => clothing['id_category'] === 13);
  }

  // helper functions for colormatching algo

  // returns random whole number from 0 to max
  getRandomIndex(max) {
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * maxInt);
  };

  // selects random match method
  chooseMatchMethod() {
    const methods = ['colorMatch', 'monochromatic', 'allNeutral'];
    const randomMethod = methods[this.getRandomIndex(methods.length)];
    return randomMethod;
  }

  chooseOccasion() {
    const occasions = ['casual', 'formal', ]
  }

  // returns outfit object with up to two matching colors in palette
  colorMatch(arrayOfClothingObjs) {
    return 'colormatch'
  }

  // returns outfit object with one color for every clothing item
  monochromatic() {
    // object to hold current outfit being built
    const monoOutfit = {};
    // start with random top
    const starterpiece = this.tops[this.getRandomIndex(this.tops.length)];
    // get color from top - NOTE TO LAURA - AMEND LATER TO CHOOSE EITHER FIRST OR SECOND COLOR
    const color = starterpiece.color.split(', ')[0];
    // assign top to current outfit
    monoOutfit['top'] = starterpiece;

    // loop through bottoms to select matching bottom by color
    for (let i = 0; i < this.bottoms.length; i++) {
      // check if current bottom matches top by color
      if(this.bottoms[i].color.includes(color)) {
        monoOutfit['bottom'] = this.bottoms[i];
      }
    }

    // loop through outwears to select matching outerwears by color
    for (let i = 0; i < this.outerwears.length; i++) {
      // check if current outerwear matches top by color
      if (this.outerwears[i].color.includes(color)) {
        monoOutfit['outerwear'] = this.outerwears[i];
      }
    }

    monoOutfit['shoes'] = this.shoes[this.getRandomIndex(this.shoes.length)]
    monoOutfit['accessory'] = this.accessories[this.getRandomIndex(this.accessories.length)]

    return monoOutfit;
  }

  // returns outfit object with any number of colors included in the 'neutrals' array
  allNeutral() {
    const neutralOutfit = {};
    const neutrals = ['black', 'grey', 'white', 'tan', 'navy']

    // get and assign neutral top
    for (let i = 0; i < this.tops.length; i++) {
      if (neutrals.includes(this.tops[i].color)) {
        neutralOutfit['top'] = this.tops[i];
      }
    }

    // get and assign neutral bottom
    for (let i = 0; i < this.bottoms.length; i++) {
      if (neutrals.includes(this.bottoms[i].color)) {
        neutralOutfit['bottom'] = this.bottoms[i];
      }
    }

    // get and assign neutral outerwear
    for (let i = 0; i < this.outerwears.length; i++) {
      if (neutrals.includes(this.outerwears[i].color)) {
        neutralOutfit['outerwear'] = this.outerwears[i];
      }
    }

    neutralOutfit['shoes'] = this.shoes[this.getRandomIndex(this.shoes.length)]
    neutralOutfit['accessory'] = this.accessories[this.getRandomIndex(this.accessories.length)]
    
    return neutralOutfit;
  }

  checkWeather() {
    //remember to import weather apiservice for weather
  }

  //checks to see if each clothing item in outfit is the same occasion
  //returns a boolean
  checkOccasion(outfitObj) {
    // const occasion = outfitObj['top']['occasion'];
    // for (let key in outfitObj) {
    //   if (outfitObj[key]['occasion'] !== occasion) {
    //     return false;
    //   }
    // }
    return true;
  }

  // select matching outfit
  // takes in match method and reassigns OOTD to outfit with that method
  // order of selection: occasion => weather => matching
  chooseMatchingOutfit(method) {
    // if no method is selected, select random matching method
    if (!method) {
      method = this.chooseMatchMethod();
    }

    // current outfit selected by method
    const currOutfitSelection = this[method](this.closet);
    
    // check if clothing selections are all the same occasion
    // NOTE FOR LAURA - MAYBE PUT THIS CONDITIONAL IN WHEN THE OUTFIT IS ACTUALLY BUILDING AND NOT WHEN IT'S FINISHED
    if (this.checkOccasion(currOutfitSelection)) {
      // reassign outfit to be outfit chosen by method
      this.outfit = currOutfitSelection;
      console.log(this.outfit, 'outfit selected');
      return;
    } else {
      console.log('recurse');
      // this.chooseMatchingOutfit(method, count + 1, totalCombos);
    }
  }
}
