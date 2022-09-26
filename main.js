const featureModal = document.getElementById('featureModal');
const featuresList = document.getElementById('featuresList');
const saveFeatureBtn = document.getElementById('saveFeature');
const plusBtn = document.getElementById('valuePlusBtn');
const features = document.getElementById('features');
const answerType = document.getElementById('AnswerType');
const isRequired = document.getElementById('isRequired');


function getFeatureValues(tr) {
    const tableBody1 = tr.firstElementChild.querySelector('tbody');
    const row11 = tableBody1.firstElementChild;
    const row12 = row11.nextElementSibling;
    const row13 = row12.nextElementSibling;

    const tableBody2 = tr.lastElementChild.querySelector('tbody');
    let values = [];
    for (let index = 0; index < tableBody2.childElementCount; index++) {
        const row2x = tableBody2.children[index];
        const value = row2x.firstElementChild.textContent;
        const price = row2x.lastElementChild.textContent;
        values.push({
            'featureValue': value,
            'featurePrice': price
        });
    }

    return {
        'featureName': row11.firstElementChild.textContent,
        'answerType': row12.lastElementChild.textContent,
        'required': (row13.lastElementChild.textContent == 'Yes') ? true : false,
        'values': values
    }
}


window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-close').forEach(btn => {
        AddDeleteLiFn(btn);
    });
});

plusBtn.addEventListener('click', () => {
    let lastInput = featuresList.lastElementChild.firstElementChild;
    if (lastInput.value == '') {
        lastInput.focus();
        return;
    }
    let newLi = createLi();
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

saveFeatureBtn.addEventListener('click', () => {
    let formValid = true;
    const nameField = featureModal.querySelector('[name="feature-name"]');
    if(nameField.value.length < 1) {
        nameField.focus();
        formValid = false;
        return;
    }

    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    tr.setAttribute('class', 'border-dark');
    td1.setAttribute('class', 'border-dark p-0 w-50');
    td2.setAttribute('class', 'border-dark p-0 w-50');

    const innerTable1 = document.createElement('table');
    const tableBody1 = document.createElement('tbody');
    innerTable1.appendChild(tableBody1);
    innerTable1.setAttribute('class', 'table mb-0');

    const td11 = document.createElement('td');
    const td12 = document.createElement('td');
    const td13 = document.createElement('td');
    const td14 = document.createElement('td');
    const td15 = document.createElement('td');
    const td16 = document.createElement('td');

    const editBtn = document.createElement('a');
    editBtn.setAttribute('class', 'card-link');
    editBtn.setAttribute('href', '#');
    editBtn.appendChild(document.createTextNode('Edit'));
    AddEditFn(editBtn);
    
    const delBtn = document.createElement('a');
    delBtn.setAttribute('class', 'card-link text-red');
    delBtn.setAttribute('href', '#');
    delBtn.appendChild(document.createTextNode('Delete'));
    AddDeleteFeatureFn(delBtn);

    const innerTable2 = document.createElement('table');
    const tableBody2 = document.createElement('tbody');
    innerTable2.appendChild(tableBody2);
    innerTable2.setAttribute('class', 'table mb-0');

    const clean = (value) => (value.length > 0) ? value : '---';

    for (let index = 0; index < featuresList.childElementCount; index++) {
        const li = featuresList.children[index];
        const valueField = li.querySelector('[name="feature-value"]');
        const priceField = li.querySelector('[name="feature-price"]');

        if (valueField.value.length < 1) {
            valueField.focus();
            formValid = false;
            break;
        }

        const innerRow2x = document.createElement('tr');
        const innerTd2x1 = document.createElement('td');
        const innerTd2x2 = document.createElement('td');
        innerTd2x1.appendChild(document.createTextNode(clean(valueField.value)));
        innerTd2x2.appendChild(document.createTextNode(clean(priceField.value)));
        innerRow2x.appendChild(innerTd2x1);
        innerRow2x.appendChild(innerTd2x2);
        tableBody2.appendChild(innerRow2x);
    }

    if (formValid) {
        const checkvalue = (isRequired.checked) ? 'Yes' : 'No';
        td11.appendChild(document.createTextNode(nameField.value));
        td12.appendChild(editBtn);
        td12.appendChild(delBtn);
        td13.appendChild(document.createTextNode('Answer Type:'));
        td14.appendChild(document.createTextNode(answerType.value));
        td15.appendChild(document.createTextNode('Required:'));
        td16.appendChild(document.createTextNode(checkvalue));
        td11.setAttribute('class', 'fw-bold');

        const row11 = document.createElement('tr');
        const row12 = document.createElement('tr');
        const row13 = document.createElement('tr');
        row11.appendChild(td11);
        row11.appendChild(td12);
        row12.appendChild(td13);
        row12.appendChild(td14);
        row13.appendChild(td15);
        row13.appendChild(td16);

        tableBody1.appendChild(row11);
        tableBody1.appendChild(row12);
        tableBody1.appendChild(row13);
        innerTable1.appendChild(tableBody1);

        td1.appendChild(innerTable1);
        td2.appendChild(innerTable2);

        tr.appendChild(td1);
        tr.appendChild(td2);

        if (saveFeatureBtn.hasAttribute('data-edit-index')) {
            const index = saveFeatureBtn.dataset.editIndex;
            features.removeChild(features.children[index]);
            features.insertBefore(tr, features.children[index]);
            saveFeatureBtn.removeAttribute('data-edit-index');
        } else {
            features.appendChild(tr);
            console.log(getFeatureValues(tr));
        }
        featureModal.querySelector('[data-bs-dismiss="modal"]').click();
    }
});

featureModal.addEventListener('shown.bs.modal', () => {
    featureModal.querySelector('input').focus();
});

featureModal.addEventListener('hidden.bs.modal', () => {
    clearFields();
});


// create new item
function createLi() {
    let li = document.createElement('li');
    let inputValue = document.createElement('input');
    let inputPrice = document.createElement('input');
    let deleteBtn = document.createElement('button');

    li.setAttribute('class', 'line-focus d-flex position-relative mb-2')

    inputValue.setAttribute('type', 'text');
    inputValue.setAttribute('name', 'feature-value');
    inputValue.setAttribute('class', 'form-control');
    inputValue.setAttribute('placeholder', 'Value');
    
    inputPrice.setAttribute('type', 'number');
    inputPrice.setAttribute('min', 0);
    inputPrice.setAttribute('name', 'feature-price');
    inputPrice.setAttribute('class', 'form-control');
    inputPrice.setAttribute('placeholder', 'Price');

    deleteBtn.setAttribute('class', 'btn-close');
    deleteBtn.setAttribute('title', 'Remove');

    li.appendChild(inputValue);
    li.appendChild(inputPrice);
    li.appendChild(deleteBtn);
    AddDeleteLiFn(deleteBtn);
    return li;
}

function clearFields() {
    isRequired.checked = false;
    answerType.selectedIndex = 0;
    featureModal.querySelector('[name="feature-name"]').value = '';
    featuresList.querySelectorAll('[name="feature-value"]').forEach(field => {
        field.value = '';
        field.nextElementSibling.value = '';
        if (featuresList.childElementCount > 1) {
            featuresList.removeChild(field.parentElement);
        }
    });
}

// delete functionality
function AddDeleteLiFn(deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        if (featuresList.firstElementChild !== featuresList.lastElementChild) {
            featuresList.removeChild(deleteBtn.parentElement);
        }
    });
}

// delete functionality
function AddDeleteFeatureFn(delBtn) {
    delBtn.addEventListener('click', () => {
        const row1x = delBtn.parentElement.parentElement;
        const innerTable1 = row1x.parentElement.parentElement;
        const tr = innerTable1.parentElement.parentElement;
        features.removeChild(tr);
    });
}

// edit functionality
function AddEditFn(editBtn) {
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const featureName = editBtn.parentElement.previousSibling.textContent;
        featureModal.querySelector('[name="feature-name"]').value = featureName;

        const row11 = editBtn.parentElement.parentElement;
        const row12 = row11.nextElementSibling;
        const row13 = row12.nextElementSibling;

        answerType.value = row12.lastElementChild.textContent;
        isRequired.checked = (row13.lastElementChild.textContent == 'Yes') ? true : false;

        const editBtnTable = row11.parentElement.parentElement;
        const tableBody2 = editBtnTable.parentElement.nextElementSibling.querySelector('tbody');

        for (let index = 0; index < tableBody2.childElementCount; index++) {
            const row2x = tableBody2.children[index];
            const value = row2x.firstElementChild.textContent;            
            const price = row2x.lastElementChild.textContent;

            let li = null;
            
            if(index == 0) {
                li = featuresList.firstElementChild;
            } else {
                li = createLi();
                featuresList.appendChild(li);
            }

            li.querySelector('[name="feature-value"]').value = value;
            li.querySelector('[name="feature-price"]').value = price;
        }
        document.querySelector('[data-bs-toggle="modal"]').click();
        rowIndex = Array.prototype.indexOf.call(
            features.children, 
            editBtnTable.parentElement.parentElement
        );
        saveFeatureBtn.setAttribute('data-edit-index', rowIndex);
    });
}

function insertAfter(newElement, existingElement) {
    existingElement.parentElement.insertBefore(newElement, existingElement.nextElementSibling);
}