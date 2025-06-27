const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class NumberArray {
    constructor(size) {
        this.numbers = Array.from({ length: size }, function () {
            return Math.floor(Math.random() * 100);
        });
    }
    
    generateRandomNumbers() {
        this.numbers = Array.from({ length: 20 }, function () {
            return Math.floor(Math.random() * 100);
        });
    }
}

class Algorithm {
    constructor() {
        this.executionTime = 0;
    }
    
    execute(arr) {
        throw new Error("Method 'execute' must be implemented in subclasses");
    }
}

class BubbleSort extends Algorithm {
    execute(arr) {
        let sortedArr = arr.slice();
        let start = Date.now();
        for (let i = 0; i < sortedArr.length - 1; i++) {
            for (let j = 0; j < sortedArr.length - i - 1; j++) {
                if (sortedArr[j] > sortedArr[j + 1]) {
                    let temp = sortedArr[j];
                    sortedArr[j] = sortedArr[j + 1];
                    sortedArr[j + 1] = temp;
                }
            }
        }
        this.executionTime = Date.now() - start;
        return { sortedArray: sortedArr, time: this.executionTime };
    }
}

class QuickSort extends Algorithm {
    execute(arr) {
        let start = Date.now();
        function quickSort(arr) {
            if (arr.length <= 1) {
                return arr;
            }
            let pivot = arr[arr.length - 1];
            let left = arr.filter(function (num) { return num < pivot; });
            let right = arr.filter(function (num) { return num > pivot; });
            return quickSort(left).concat(pivot, quickSort(right));
        }
        let sortedArray = quickSort(arr);
        this.executionTime = Date.now() - start;
        return { sortedArray: sortedArray, time: this.executionTime };
    }
}

class LinearSearch extends Algorithm {
    execute(arr, value) {
        let start = Date.now();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                this.executionTime = Date.now() - start;
                return { index: i, time: this.executionTime };
            }
        }
        this.executionTime = Date.now() - start;
        return { index: -1, time: this.executionTime };
    }
}

class BinarySearch extends Algorithm {
    execute(arr, value) {
        let start = Date.now();
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (arr[mid] === value) {
                this.executionTime = Date.now() - start;
                return { index: mid, time: this.executionTime };
            } else if (arr[mid] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        this.executionTime = Date.now() - start;
        return { index: -1, time: this.executionTime };
    }
}

const numArray = new NumberArray(20);
const bubbleSort = new BubbleSort();
const quickSort = new QuickSort();
const linearSearch = new LinearSearch();
const binarySearch = new BinarySearch();

function mainMenu() {
    console.log("\n=== Main Menu ===");
    console.log("1. Generate Random Numbers");
    console.log("2. Sort Numbers");
    console.log("3. Search for a Number");
    console.log("4. Exit");
    rl.question("Choose an option: ", function (choice) {
        if (choice === "1") {
            numArray.generateRandomNumbers();
            console.log("\nNew random numbers generated:", numArray.numbers);
            mainMenu();
        } else if (choice === "2") {
            console.log("\nChoose sorting method:");
            console.log("1. Bubble Sort");
            console.log("2. Quick Sort");
            rl.question("Enter choice: ", function (sortChoice) {
                let result;
                if (sortChoice === "1") {
                    result = bubbleSort.execute(numArray.numbers);
                } else if (sortChoice === "2") {
                    result = quickSort.execute(numArray.numbers);
                }
                if (result) {
                    console.log("\nSorted Array:", result.sortedArray);
                    console.log("Execution Time:", result.time, "ms");
                }
                mainMenu();
            });
        } else if (choice === "3") {
            rl.question("Enter number to search: ", function (searchValue) {
                console.log("\nChoose search method:");
                console.log("1. Linear Search");
                console.log("2. Binary Search");
                rl.question("Enter choice: ", function (searchChoice) {
                    let result;
                    if (searchChoice === "1") {
                        result = linearSearch.execute(numArray.numbers, parseInt(searchValue));
                    } else if (searchChoice === "2") {
                        let sortedArr = quickSort.execute(numArray.numbers).sortedArray;
                        result = binarySearch.execute(sortedArr, parseInt(searchValue));
                    }
                    if (result) {
                        if (result.index !== -1) {
                            console.log("Number found at index:", result.index);
                        } else {
                            console.log("Number not found.");
                        }
                        console.log("Execution Time:", result.time, "ms");
                    }
                    mainMenu();
                });
            });
        } else if (choice === "4") {
            console.log("Exiting program.");
            rl.close();
        } else {
            console.log("Invalid choice, try again.");
            mainMenu();
        }
    });
}

mainMenu();
