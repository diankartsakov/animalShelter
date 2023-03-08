

class Animal {

    constructor(name,image,type,bread,age,sex,neededAmount, currentlyRisedAmount){

        this.name = name;
        this.image = image;
        this.type = type;
        this.bread = bread;
        this.age = age;
        this.sex = sex;
        this.neededAmount = Number(neededAmount);
        this.currentlyRisedAmount = Number(currentlyRisedAmount);
        this.isAdopted = false;
        this.adoptedDate = "";

    }
}

class HistoryItem {
    constructor(date,name,sum){
        this.date = date;
        this.name = name;
        this.sum = sum;
    }
}


class AnimalManager {

    constructor(){
        this.allAnimals = DATA.map(item => new Animal(
            item.name,
            "./images/" + item.image,
            item.type,
            item.bread,
            item.age,
            item.sex,
            Number(item.neededAmount),
            Number(item.currentlyRisedAmount)

        ))
        this.adoptedAnimals =[];
        this.typeList = this.generateTypeSelect();
        this.history = [];
    }


    donate = (name,sum) => {

        let donateForName = this.allAnimals.find(animal => animal.name === name);

        if(donateForName.currentlyRisedAmount + sum > donateForName.neededAmount){
            sum = donateForName.neededAmount - donateForName.currentlyRisedAmount;
        }

        donateForName.currentlyRisedAmount += sum;
        return sum;

    }

    // addHistoryItem = (date, name, sum) => {


    //     this.history.push(new HistoryItem(date,name,sum));

    // }

    searchByName = (name) => {

        return this.allAnimals.filter(item => item.name.toLowerCase().includes(name.trim().toLowerCase()));

    }
    searchByType = (type) => {

        return this.allAnimals.filter(item => item.type === type);

    }

    addToAdopted = (item) => {

        if(!item.isAdopted){
            item.isAdopted = true;
            let index = this.allAnimals.indexOf(item);
            this.allAnimals.splice(index,1);
            this.adoptedAnimals.push(item);
        } 
        else {
            item.isAdopted = false;
            let index = this.adoptedAnimals.indexOf(item);
            this.adoptedAnimals.splice(index,1);
            this.allAnimals.unshift(item);
        }
    }

    generateTypeSelect = () => {
        const result = [];

        this.allAnimals.forEach(item => {
         
            if(!result.includes(item.type)){
                result.push(item.type);
            }
        })
        return result;
    }

    


}