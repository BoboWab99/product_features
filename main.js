// adding new/removing features
const featureModal = document.getElementById('featureModal');
const plusButton = document.getElementById('valuePlusBtn');
const featuresList = document.getElementById('featuresList');
const saveFeature = document.getElementById('saveFeature');
const features = document.getElementById('features');

let addedFeatures = []


window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-close').forEach(btn => {
        deleteLiTrigger(btn);
    });
});

saveFeature.addEventListener('click', () => {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerHTML = featureModal.querySelector('[name="feature-name"]').value;
    featuresList.querySelectorAll('[name="feature-value"]').forEach(field => {
        addedFeatures.push(field.value);
        td2.innerHTML += field.value;
        td2.innerHTML += ', ';
        field.value = '';
    });
    featureModal.querySelector('[name="feature-name"]').value = '';
    tr.appendChild(td1);
    tr.appendChild(td2);
    features.querySelector('tbody').appendChild(tr);
    featureModal.querySelector('[data-bs-dismiss="modal"]').click();
    console.log(addedFeatures);
});


answerYes = document.getElementById('answerYes');
answerYes.addEventListener('change', () => {
    let prices = document.getElementById('prices');
    let h5 = document.createElement('h5');
    h5.appendChild(document.createTextNode('Prices per feature value'));
    h5.setAttribute('class', 'my-4');
    prices.innerHTML = '';
    prices.appendChild(h5);

    if (answerYes.checked) {
        let createFormField = (label) => {
            let row = document.createElement('div');
            let col1 = document.createElement('div');
            let col2 = document.createElement('div');
            let _label = document.createElement('label');
            let input = document.createElement('input');
            _label.appendChild(document.createTextNode(label));
            row.setAttribute('class', 'row row-cols-2 mb-2');
            col1.setAttribute('class', 'col-4');
            col2.setAttribute('class', 'col-8');
            input.setAttribute('type', 'text');
            input.setAttribute('class', 'form-control');
            row.appendChild(col1);
            row.appendChild(col2);
            col1.appendChild(_label);
            col2.appendChild(input);
           prices.appendChild(row);
        }
        addedFeatures.forEach(value => createFormField(value));
        addedFeatures = []
    }
});

// ADDING
function createLi() {
    let li = document.createElement('li');
    let input = document.createElement('input');
    let deleteBtn = document.createElement('button');

    li.classList.add('line-focus', 'position-relative', 'mb-2');
    deleteBtn.classList.add('btn-close');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'feature-value');
    input.classList.add('form-control', 'border-0', 'border-bottom', 'rounded-0')

    // focus_on_diff(input, li, 'activate_focus');
    li.appendChild(input);
    li.appendChild(deleteBtn);
    deleteLiTrigger(deleteBtn);
    deleteBtn.setAttribute('title', 'Remove')
    return li;
}

function deleteLiTrigger(deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        if (featuresList.firstElementChild !== featuresList.lastElementChild) {
            featuresList.removeChild(deleteBtn.parentElement);
        }
    });
}

function insertAfter(newElement, existingElement) {
    existingElement.parentElement.insertBefore(newElement, existingElement.nextElementSibling);
}

plusButton.addEventListener('click',  () => {
    let lastInput = featuresList.lastElementChild.firstElementChild;
    if (lastInput.value == '') {
        lastInput.focus();
        return;
    }
    let newLi =  createLi();
    featuresList.append(newLi);
    newLi.firstElementChild.focus();
});

featuresList.addEventListener('keydown', (e) => {
    let keyCode = e.key || e.code;
    if (keyCode !== 'Enter') return;
    if (e.target.value == '') return;

    let lastLi = featuresList.lastElementChild;
    let newLi = createLi();

    if (lastLi.contains(e.target)) featuresList.append(newLi);
    else insertAfter(newLi, e.target.parentElement);    
    newLi.firstElementChild.focus();
    
});