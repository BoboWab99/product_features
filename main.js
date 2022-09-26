const featureModal = document.getElementById('featureModal');
const featuresList = document.getElementById('featuresList');
const saveFeatureBtn = document.getElementById('saveFeature');
const plusBtn = document.getElementById('valuePlusBtn');
const features = document.getElementById('features');


window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-close').forEach(btn => {
        AddDeleteFn(btn);
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
    let nameField = featureModal.querySelector('[name="feature-name"]');
    if(nameField.value.length < 1) {
        nameField.focus();
        formValid = false;
        return;
    }

    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td2.setAttribute('colspan', 2);
    td2.style.padding = '0';

    let innerTable = document.createElement('table');
    let tableBody = document.createElement('tbody');
    innerTable.appendChild(tableBody);
    innerTable.setAttribute('class', 'table mb-0');

    let editBtn = document.createElement('a');
    editBtn.setAttribute('class', 'card-link ms-2');
    editBtn.setAttribute('href', '#');
    editBtn.appendChild(document.createTextNode('Edit'));
    AddEditFn(editBtn);

    let clean = (value) => (value.length > 0) ? value : '---';

    for (let index = 0; index < featuresList.childElementCount; index++) {
        const li = featuresList.children[index];
        const valueField = li.querySelector('[name="feature-value"]');
        const priceField = li.querySelector('[name="feature-price"]');

        if (valueField.value.length < 1) {
            valueField.focus();
            formValid = false;
            break;
        }

        let innerRow = document.createElement('tr');
        let innerTd1 = document.createElement('td');
        let innerTd2 = document.createElement('td');
        innerTd1.appendChild(document.createTextNode(clean(valueField.value)));
        innerTd2.appendChild(document.createTextNode(clean(priceField.value)));
        innerRow.appendChild(innerTd1);
        innerRow.appendChild(innerTd2);
        tableBody.appendChild(innerRow);
    }

    if (formValid) {
        td1.appendChild(document.createTextNode(nameField.value));
        td1.appendChild(editBtn);
        td2.appendChild(innerTable);
        tr.appendChild(td1);
        tr.appendChild(td2);

        if (saveFeatureBtn.hasAttribute('data-edit-index')) {
            const index = saveFeatureBtn.dataset.editIndex;
            features.removeChild(features.children[index]);
            features.insertBefore(tr, features.children[index]);
            saveFeatureBtn.removeAttribute('data-edit-index');
        } else {
            features.appendChild(tr);
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
    AddDeleteFn(deleteBtn);
    return li;
}

function clearFields() {
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
function AddDeleteFn(deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        if (featuresList.firstElementChild !== featuresList.lastElementChild) {
            featuresList.removeChild(deleteBtn.parentElement);
        }
    });
}

// edit functionality
function AddEditFn(editBtn) {
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        featureModal.querySelector('[name="feature-name"]').value = editBtn.previousSibling.textContent;
        innerTableBody = editBtn.parentElement.nextElementSibling.querySelector('tbody');

        for (let index = 0; index < innerTableBody.childElementCount; index++) {
            const row = innerTableBody.children[index];
            const value = row.firstElementChild.textContent;            
            const price = row.lastElementChild.textContent;

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
            editBtn.parentElement.parentElement
        );
        saveFeatureBtn.setAttribute('data-edit-index', rowIndex);
    });
}

function insertAfter(newElement, existingElement) {
    existingElement.parentElement.insertBefore(newElement, existingElement.nextElementSibling);
}