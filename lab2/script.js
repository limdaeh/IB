class EncryptionSystem {
    constructor() {
        this.matrix = [];
        this.password = '';
        this.encodedSymbols = {};
        this.encodedMessageArray = [];
        this.encodedMessageStr = '';
        this.decodedMessageStr = '';

        this.createTableOfKeys();
        this.completionTableOfSymbols();
    }

    createTableOfKeys() {
        ["", "A", "D", "F", "G", "V", "X"].forEach(element => {
            this.matrix.push([element])
        });
        ["A", "D", "F", "G", "V", "X"].forEach(element => {
            this.matrix[0].push(element)
        })
    }

    createRandomIndex(minimum, maximum) {
        return Math.floor(Math.random() * (Math.floor(maximum) - Math.floor(minimum) + 1) + Math.floor(minimum)); 
    }

    getRandomSymbol(symbolsArray){
        const randomSymbolIndex = this.createRandomIndex(0, symbolsArray.length - 1);
        const returnedSymbol = symbolsArray[randomSymbolIndex];
        symbolsArray.splice(randomSymbolIndex, 1);
        return returnedSymbol;
    }

    completionTableOfSymbols() {
        this.encodedSymbols = {};
        const symbolsArray = [
            'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9'
        ];
        for (let i = 1; i < this.matrix[0].length; i++) {
            for (let j = 1; j < this.matrix.length; j++) {
                const symbol = this.getRandomSymbol(symbolsArray) + "";
                this.matrix[i].push(symbol);
                this.encodedSymbols[symbol] = this.matrix[i][0] + this.matrix[0][j]
            }
        }
    }

    assignPassword(password = '') {
        if (password.replace(' ', '') == '') {
            console.log("Пароль пустой")
            return;
        }
        else {
            this.password = password.toUpperCase().replace("\n", '');
        }
    }

    // encryptMessage(message = '') {

    //     if (!/^[a-zA-Z0-9.,!?;:'"()\[\]{}\- ]+$/.test(message)) {
    //         console.log("В сообщении некорректные символы");
    //         return;
    //     }
    //     const keyBecomeArray = this.password.toUpperCase()
    //         .split('')
    //         .map(letter => [letter]);

            
    //         const encodedMessageTable = [...keyBecomeArray];

    //         console.log(encodedMessageTable)
        
    //         const messageArray = message
    //         .replace(/[^a-zA-Z0-9.,:;!?()'"-\s]/g, '') 
    //         .toUpperCase()
    //         .split('');

    //     // console.log(keyBecomeArray)
    //     const keyLength = keyBecomeArray.length;
    //     let itter = 0;
    //     messageArray.forEach(element => {
    //         // console.log(this.encodedSymbols[element]);
    //         if (itter >= keyLength) {
    //             itter = 0;
    //         }
    //         if (this.encodedSymbols[element]) {
    //             encodedMessageTable[itter].push(this.encodedSymbols[element]);
    //         } else {
    //             encodedMessageTable[itter].push(element + element); 
    //             // console.log(element+element, '!')
    //         }
    //         itter++;
    //     });
    //     itter = 0;
    //     // console.log(encodedMessageTable);
    //     while (itter < keyLength) {
    //         encodedMessageTable[itter].push('  ');
    //         itter++;
    //     }
        
    //     this.encodedMessageArray = encodedMessageTable.sort((a, b) => {
    //         if (a[0] < b[0]) return -1;
    //         if (a[0] > b[0]) return 1;
    //         return 0;
    //     });
    //     // console.log(encodedMessageTable);
        
    //     this.convertEncryptedMessageToString();
    // }

    encryptMessage(message = '') {
        if (!/^[a-zA-Z0-9.,!?;:'"()\[\]{}\- ]+$/.test(message)) {
            console.log("В сообщении некорректные символы");
            return;
        }
    
        const keyBecomeArray = this.password.toUpperCase()
            .split('')
            .map(letter => [letter]);
    
        const encodedMessageTable = [...keyBecomeArray];
        const keyLength = keyBecomeArray.length;
    
        const messageArray = message
            .replace(/[^a-zA-Z0-9.,:;!?()'"-\s]/g, '')
            .toUpperCase()
            .split('');
    
        let itter = 0;
    
        messageArray.forEach(element => {
            if (this.encodedSymbols[element]) {
                encodedMessageTable[itter].push(this.encodedSymbols[element]);
            } else {
                encodedMessageTable[itter].push(element + element);
            }
            console.log(itter)
            itter = (itter + 1) % keyLength; // Итерация с возвратом в начало
        });
    
        // Уравнять длины массивов
        const maxLength = Math.max(...encodedMessageTable.map(arr => arr.length));
        for (let i = 0; i < encodedMessageTable.length; i++) {
            while (encodedMessageTable[i].length < maxLength) {
                encodedMessageTable[i].push('  '); // Заполнение до одинаковой длины
            }
        }
    
        // Сортировка по первому символу
        this.encodedMessageArray = encodedMessageTable.sort((a, b) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
        });

        console.log(encodedMessageTable);

        this.convertEncryptedMessageToString();
    }

    convertEncryptedMessageToString() {
        let result = [];
        const numRows = this.encodedMessageArray.length;
        const numColumns = this.encodedMessageArray[0].length;

        for (let column = 1; column < numColumns; column++) {
            for (let row = 0; row < numRows; row++) {
                result.push(this.encodedMessageArray[row][column]);
            }
        }
        // console.log(result)
        this.encodedMessageStr = result.join('');
    }

    decryptMessage(password = this.password.slice(), encodeMessage = this.encodedMessageStr.slice()) {
        let currentIndex = 0;
        const cleanedMessage = encodeMessage.toUpperCase()
        .replace(/[^a-zA-Z0-9\s.,;:()[]{}!?'"-]/g, '')  
        .match(/.{1,2}/g); 
        const sanitizedKeyWord = password.replace("\n", '').toUpperCase().split('');
        const sortedKeyWordArray = sanitizedKeyWord.slice().sort().map(element => [element]);
        const keyLength = sortedKeyWordArray.length;
        // console.log(encodeMessage)
        cleanedMessage.forEach(element => {
            if (currentIndex >= keyLength) {
                currentIndex = 0; 
            }
            sortedKeyWordArray[currentIndex].push(element); 
            currentIndex++; 
        });

        const getKeyValue = (object, value) => {
            for (let key in object) {
                if (object[key] === value) {
                    return key;
                }
            }
            // console.log(value)
            return (value[0])
        }
        let itter = 0
        const tableSortedByKey = []; 
        const sortedTable = sortedKeyWordArray.slice();
        sanitizedKeyWord.forEach(element => {
            sortedTable.forEach(array => {
                if (array[0] == element) {
                    itter++
                    const index = sortedTable.indexOf(array);
                    tableSortedByKey.push(sortedTable[index].slice());
                    sortedTable.splice(index, 1);
                    return;
                }
            });

        });
        // console.log(sortedKeyWordArray, sanitizedKeyWord)
        const resultTable = [];
        // console.log(tableSortedByKey)
        for (let i = 1; i < tableSortedByKey[0].length; i++) {
            for (let j = 0; j < tableSortedByKey.length; j++) {
                // console.log(tableSortedByKey[j][i])
                resultTable.push(getKeyValue(this.encodedSymbols, tableSortedByKey[j][i]));
            }
        };
        this.decodedMessageStr = resultTable.join('');
    }
}
const encryptionSystem = new EncryptionSystem();

document.getElementById('passwordInput').addEventListener('input', function () {
    encryptionSystem.assignPassword(this.value);
});

document.getElementById('encryptButton').addEventListener('click', function () {
    const message = document.getElementById('messageInput').value;
    encryptionSystem.encryptMessage(message);
    document.getElementById('encryptedMessage').value = encryptionSystem.encodedMessageStr;
});

document.getElementById('decryptButton').addEventListener('click', function () {
    const encryptedMessage = document.getElementById('encryptedMessage').value;
    encryptionSystem.decryptMessage(encryptionSystem.password, encryptedMessage);
    // console.log(encryptionSystem)
    document.getElementById('decryptedMessage').value = encryptionSystem.decodedMessageStr;
});
