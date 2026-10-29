
class Parcel {
    #weight;
    static #count = 0;

    constructor(recipient, weight, length, width, height) {
        this.recipient = recipient;
        this.weight = weight;
        this.length = length;
        this.width = width;
        this.height = height;

        Parcel.#count++;
    }

    get weight() {
        return this.#weight;
    }

    set weight(value) {
        if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
            throw new Error("Вага посилки має бути додатним числом");
        }
        this.#weight = value;
    }

    get volumetricWeight() {
        return this.length * this.width * this.height / 5000;
    }

    get chargeableWeight() {
        return Math.max(this.weight, this.volumetricWeight);
    }

    describe() {
        return `Посилка для ${this.recipient}, вага ${this.weight} кг, розміри ${this.length}x${this.width}x${this.height} см`;
    }

    static getCount() {
        return Parcel.#count;
    }
}

class ParcelPriceCalculator {
    constructor(ratePerKg) {
        this.ratePerKg = ratePerKg;
    }

    calculate(parcel) {
        return parcel.chargeableWeight * this.ratePerKg;
    }

    getName() {
        return "Базовий тариф";
    }
}

// Доставка через відділення пошти
class PostOfficeParcelPriceCalculator extends ParcelPriceCalculator {
    constructor() {
        super(15);
    }

    getName() {
        return "Відділення пошти";
    }
}

// Кур'єрська доставка
class CourierParcelPriceCalculator extends ParcelPriceCalculator {
    constructor() {
        super(30);
    }

    getName() {
        return "Кур'єрська доставка";
    }
}

// Експрес-доставка
class ExpressParcelPriceCalculator extends ParcelPriceCalculator {
    constructor() {
        super(30);
        this.expressRatePerKg = 25;
    }

    calculate(parcel) {
        return super.calculate(parcel) +
            parcel.chargeableWeight * this.expressRatePerKg;
    }

    getName() {
        return "Експрес-доставка";
    }
}

const parcels = [
    new Parcel("Іван Мельник", 5, 20, 20, 20),
    new Parcel("Ольга Антонюк", 2, 50, 40, 30),
    new Parcel("Інна Войтюк", 3, 30, 20, 20)
];

const calculators = [
    new PostOfficeParcelPriceCalculator(),
    new CourierParcelPriceCalculator(),
    new ExpressParcelPriceCalculator()
];

for (const parcel of parcels) {
    console.log("----------------------------");
    console.log(parcel.describe());

    console.log("Об'ємна вага: " +
        parcel.volumetricWeight.toFixed(2) + " кг");

    console.log("Розрахункова вага: " +
        parcel.chargeableWeight.toFixed(2) + " кг");

    for (const calculator of calculators) {
        console.log(
            calculator.getName() + ": " +
            calculator.calculate(parcel).toFixed(2) + " грн"
        );
    }
}

console.log("----------------------------");
console.log("Кількість створених посилок: " + Parcel.getCount());
