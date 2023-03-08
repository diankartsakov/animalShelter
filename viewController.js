
class ViewController {

    constructor() {

        window.addEventListener('hashchange', this.handleHashChange),
        window.addEventListener('load', this.handleHashChange),
        this.animalManager = new AnimalManager();
    }

    handleHashChange = () => {

        let hash = window.location.hash.slice(1) || 'home';

        const pageIds = ['login', 'register', 'home', 'adopted', 'donate'];

        // add all page view in pageIds array 

        if (hash === 'home' || hash === 'adopted') {
            if (!userManager.loggedUser) {
                location.hash = 'login';
                return;
            }
        }

        let logoutBtn = document.getElementById('logout');
        let registerNav = document.getElementById('registerNav');
        let loginNav = document.getElementById('loginNav');

        if(userManager.loggedUser){
            logoutBtn.style.display = 'flex';
            registerNav.style.display = 'none';
            loginNav.style.display = 'none';
        }

        if(hash === "logout" && userManager.loggedUser){

            logoutBtn.style.display = 'none';
            registerNav.style.display = 'flex';
            loginNav.style.display = 'flex';

            userManager.logout();
            location.hash = 'login';

        }

        pageIds.forEach(id => {

            let element = document.getElementById(id);

            if (hash === id && hash !== 'home') {

                element.style.display = 'flex';
            }
            else if (hash === id && hash === 'home') {
                element.style.display = 'block';
            }
            else {
                element.style.display = 'none';
            }
        })

        switch (hash) {

            case 'login':
                this.renderLogin();
                break;
            case 'register':
                this.renderRegister();
                break;
            case 'home':
                this.renderHomePage();
                break;
            case 'adopted':
                this.renderAdoptPage();
                break;
            case 'donate':
                this.renderDonateForm();
                break;

        }
    }

    renderLogin = () => {

        let form = document.getElementById('loginForm');
        let error = document.getElementById('loginError');
        error.style.display = 'none';

        form.addEventListener('change', (e) => {

            let username = e.target.parentElement.elements.username.value;
            let pass = e.target.parentElement.elements.password.value;
            let loginBtn = document.getElementById('loginBtn');

            if (username.trim().length !== 0 && pass.length !== 0) {
                loginBtn.disabled = false;
            }
            else {
                loginBtn.disabled = true;
            }

        })



        form.onsubmit = (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            let pass = e.target.elements.password.value;

            let successfulLogin = userManager.login({ username, pass });

            if (successfulLogin) {
                
                document.getElementById('logout').style.display = 'flex';

                location.hash = 'home';
                error.style.display = 'none';
            }
            else {
                error.style.display = 'block';
            }
            e.target.reset();
        };
    }

    renderRegister = () => {

        let form = document.getElementById('registerForm');

        form.removeEventListener('change', this.regFormChange);
        form.addEventListener('change', this.regFormChange);


        form.onsubmit = (e) => {

            e.preventDefault();

            let username = e.target.elements.username.value;
            let pass = e.target.elements.password.value;

            userManager.register({ username, pass });

            e.target.reset();

            e.target.elements.submitReg.disabled = true;
        };

        let showPass = document.getElementById('showHidePass');

        showPass.removeEventListener('click', this.showHidePassEvent);
        showPass.addEventListener('click', this.showHidePassEvent);
    }

    regFormChange = (e) => {

        e.preventDefault();

        let usernameError = document.getElementById('usernameError');
        usernameError.style.display = 'none';
        let passError = document.getElementById('passError');
        passError.style.display = 'none';
        let confirmPassError = document.getElementById('confirmPassError');
        confirmPassError.style.display = 'none';

        let username = e.target.parentElement.elements.username.value;
        let pass = e.target.parentElement.elements.password.value;
        let confirmPass = e.target.parentElement.elements.confirmPassword.value;

        let existingUsername = userManager.existingUsername(username);

        if (existingUsername) {
            usernameError.style.display = 'block';
            usernameError.innerText = `${username} is already registered`;
        }
        let validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

        if (!validPass.test(pass) && pass.length !== 0) {

            passError.style.display = 'block';
        }
        if (pass !== confirmPass && confirmPass.length !== 0) {
            confirmPassError.style.display = 'block';
        }

        let submitRegBtn = document.getElementById('submitReg');

        if (usernameError.style.display === 'none' &&
            passError.style.display === 'none' &&
            confirmPassError.style.display === 'none' &&
            username.length !== 0 &&
            pass.length !== 0 &&
            confirmPass.length !== 0
        ) {
            submitRegBtn.disabled = false;
        }
        else {
            submitRegBtn.disabled = true;
        }
    }

    showHidePassEvent = (e) => {

        let passFields = document.querySelectorAll('.passField');

        if (e.target.value !== 'Hide password') {

            for (let i = 0; i < passFields.length; i++) {
                passFields[i].type = 'text';
            }
            e.target.value = 'Hide password';
        }
        else {
            for (let i = 0; i < passFields.length; i++) {
                passFields[i].type = 'password';
            }
            e.target.value = 'Show password';
        }
    }

    renderItems = (itemList, container) => {

        container.innerHTML = "";


        itemList.forEach(item => {

            let cardDiv = document.createElement('div');
            cardDiv.className = 'card';


            let cardImg = document.createElement('img');
            cardImg.src = item.image;
            cardImg.id = 'cardImg';
            cardImg.width = '200';
            cardImg.height = '200';

            let cardName = document.createElement('div');
            cardName.innerText = item.name;
            cardName.id = 'cardName';

            let cardFamily = document.createElement('div');
            cardFamily.innerText = item.type;
            cardFamily.id = 'cardFamily';

            let cardBread = document.createElement('div');
            cardBread.innerText = item.bread;
            cardBread.id = 'cardBread';

            let cardAge = document.createElement('div');
            cardAge.innerText = item.age;
            cardAge.id = 'cardAge';

            let neededSum = document.createElement('div');
            neededSum.id = 'neededSum';
            neededSum.innerText = `${item.currentlyRisedAmount}/${item.neededAmount}`;

            let adoptDate = document.createElement('div');
            adoptDate.id = 'adoptDate';
            adoptDate.innerText = new Date().toLocaleDateString();
            adoptDate.style.display = 'none';;

            let adoptBtn = document.createElement('button');
            adoptBtn.innerText = 'Adopt';
            adoptBtn.id = 'adoptBtn';

            if (item.isAdopted) {

                adoptBtn.innerText = 'Leave';
                neededSum.style.display = 'none';
                adoptDate.style.display = 'block';

            }


            adoptBtn.addEventListener('click', () => {

                this.animalManager.addToAdopted(item);
                window.location.hash = 'adopted';
                this.renderItems(this.animalManager.adoptedAnimals, document.getElementById('adoptedContainer'));


            });

            let donateBtn = document.createElement('button');
            donateBtn.innerText = 'Donate';
            donateBtn.id = 'donateBtn';

            if (item.currentlyRisedAmount >= item.neededAmount || item.isAdopted) {

                donateBtn.style.display = 'none';

            }
            donateBtn.addEventListener('click', () => {

                let donateFor = document.getElementById('animalName');
                donateFor.innerText = item.name;
                window.location.hash = 'donate';

            })

            cardDiv.append(

                cardImg,
                cardName,
                cardFamily,
                cardBread,
                cardAge,
                adoptDate,
                neededSum,
                adoptBtn,
                donateBtn
            );

            container.appendChild(cardDiv);
        })

    }

    renderHomePage = () => {

        let searchName = document.getElementById('searchName');

        searchName.addEventListener('input', (event) => {

            this.renderItems(this.animalManager.searchByName(event.target.value), document.getElementById('homeContainer'));
        })


        let searchSelect = document.getElementById('searchType');
        let optionDefault = document.createElement('option');
        optionDefault.innerText = 'Filter by type';
        optionDefault.value = "";
        searchSelect.replaceChildren(optionDefault);

        this.animalManager.typeList.forEach(type => {

            let option = document.createElement('option');
            option.value = type;
            option.innerText = type;
            searchSelect.appendChild(option);

        })

        searchSelect.addEventListener('change', (event) => {

            if (event.target.value !== "") {
                this.renderItems(this.animalManager.searchByType(event.target.value), document.getElementById('homeContainer'));
            }
            else {
                this.renderItems(this.animalManager.allAnimals, document.getElementById('homeContainer'));
            }
        })

        this.renderItems(this.animalManager.allAnimals, document.getElementById('homeContainer'));
    }


    renderAdoptPage = () => {

        this.renderItems(this.animalManager.adoptedAnimals, document.getElementById('adoptedContainer'));

    }

    renderDonateForm = () => {


        let donateForm = document.getElementById('donateForm');

        donateForm.onsubmit = (event) => {

            event.preventDefault();

            let name = document.getElementById('animalName').innerText;
            let sum = document.getElementById('donatedSum').value;

            sum = this.animalManager.donate(name, Number(sum));

            this.animalManager.history.unshift(new HistoryItem(

                `${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`,
                name,
                Number(sum)
            ));

            event.currentTarget.reset();
            location.hash = '#home';

            this.renderHistory();
        };



    }
    renderHistory = () => {
        let tableBody = document.getElementById('tableBody');

        tableBody.innerHTML = "";

        this.animalManager.history.forEach(item => {

            let row = document.createElement('tr');
            row.style.border = 'solid 2px';

            let date = document.createElement('td');
            date.innerText = item.date;

            let name = document.createElement('td');
            name.innerText = item.name;

            let sum = document.createElement('td');
            sum.innerText = item.sum;

            row.append(
                date,
                name,
                sum
            );

            tableBody.appendChild(row);
        })
    }



}

let viewController = new ViewController();