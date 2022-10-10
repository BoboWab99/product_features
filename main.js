const featureModal = document.getElementById('featureModal')
const modalFeaturesList = document.getElementById('modalFeaturesList')
const modalSaveBtn = document.getElementById('modalSaveFeature')
const modalPlusBtn = document.getElementById('modalValuePlusBtn')
const modalFeatureName = document.getElementById('modalFeatureName')
const modalAnswerType = document.getElementById('modalAnswerType')
const modalRequired = document.getElementById('modalRequired')

const ftModal = document.getElementById('ftModal')
const ftFeatureName = document.getElementById('ftFeatureName')
const ftFeaturePrice = document.getElementById('ftFeaturePrice')
const ftModalLabel = document.getElementById('ftModalLabel')
const ftFeatureDelBtn = document.getElementById('ftFeatureDel')
const ftSaveFeatureBtn = document.getElementById('ftSaveFeature')

const ftEdtModal = document.getElementById('ftEdtModal')
const ftEdtModalLabel = document.getElementById('ftEdtModalLabel')
const ftEdtfeatureName = document.getElementById('ftEdtfeatureName')
const ftEdtAnswerType = document.getElementById('ftEdtAnswerType')
const ftEdtRequired = document.getElementById('ftEdtRequired')
const ftEdtSaveFeatureBtn = document.getElementById('ftEdtSaveFeature')

const listFeatures = document.getElementById('listFeatures')

const ftCta = {
    ADD: 1,
    EDIT: 2
}

// 1. get feature values from features list child

function getFeatureValues(li) {
    let featureValuesList = li.querySelector('.feature-values')
    let featureValues = []
    // Array.from(htmlCollection) = [...htmlCollection]
    for (let _li of [...featureValuesList.children]) {
        featureValues.push({
            'featureValue': _li.querySelector('.feature-value').textContent,
            'featurePrice': _li.querySelector('.feature-price').textContent
        })
    }
    return {
        'featureName': li.querySelector('.feature-name').textContent,
        'answerType': li.querySelector('.feature-answer-type').textContent,
        'required': li.querySelector('.feature-is-required').textContent,
        'values': featureValues
    }
}

modalPlusBtn.addEventListener('click', () => {
    let lastInput = modalFeaturesList.lastElementChild.querySelector('input[name="feature-value"]')
    if (lastInput.value == '') {
        lastInput.focus()
        return
    }
    let newLi = modalCreateLi()
    modalFeaturesList.append(newLi)
    newLi.querySelector('input[name="feature-value"]').focus()
})

modalFeaturesList.addEventListener('keydown', (e) => {
    let keyCode = e.key || e.code
    if (keyCode !== 'Enter') return
    if (e.target.value == '') return

    let lastLi = modalFeaturesList.lastElementChild
    let newLi = modalCreateLi()

    if (lastLi.contains(e.target)) modalFeaturesList.append(newLi)
    else insertAfter(newLi, e.target.closest('li'))
    newLi.querySelector('input[name="feature-value"]').focus()
})

modalSaveBtn.addEventListener('click', () => {
    if(modalFeatureName.value == '') {
        modalFeatureName.focus()
        return
    }
    let featureValues = []
    const clean = (value) => (value.length > 0) ? value : '---'

    for (let li of [...modalFeaturesList.children]) {
        const valueField = li.querySelector('input[name="feature-value"]')
        const priceField = li.querySelector('input[name="feature-price"]')
        if (valueField.value == '') {
            valueField.focus()
            return
        }
        featureValues.push({
            'featureValue': clean(valueField.value),
            'featurePrice': clean(priceField.value)
        })
    }
    data = {}
    data['featureName'] = modalFeatureName.value
    data['answerType'] = modalAnswerType.value
    data['required'] = (modalRequired.checked) ? 'Yes' : 'No'
    data['values'] = featureValues
    addFeatureUI(data)
    // close modal
    featureModal.querySelector('[data-bs-dismiss="modal"]').click()
})

featureModal.addEventListener('shown.bs.modal', () => {
    modalFeatureName.focus()
})

featureModal.addEventListener('hidden.bs.modal', () => {
    clearFields()
})

ftModal.addEventListener('hidden.bs.modal', () => {
    ftFeatureName.value = ''
    ftFeaturePrice.value = ''
    ftModalLabel.innerHTML = ''
    ftFeatureDelBtn.hidden = true
})

ftSaveFeatureBtn.addEventListener('click', () => {
    if (ftFeatureName.value == '') return

    const cta = ftSaveFeatureBtn.dataset.cta
    const ftIdx = ftSaveFeatureBtn.dataset.ftIdx
    const ftValues = listFeatures.children.item(ftIdx).querySelector('.feature-values')

    if (cta == ftCta.ADD) {
        let li = createFeatureValueLi({
            'featureValue': ftFeatureName.value,
            'featurePrice': ftFeaturePrice.value
        })
        ftValues.appendChild(li)
    }
    else if (cta == ftCta.EDIT) {
        const ft = ftValues.children.item(ftSaveFeatureBtn.dataset.ftTargetIdx)
        ft.querySelector('.feature-value').innerHTML = ftFeatureName.value
        ft.querySelector('.feature-price').innerHTML = ftFeaturePrice.value
        ftSaveFeatureBtn.removeAttribute('onclick')
        ftSaveFeatureBtn.removeAttribute('data-ft-target-idx')
    }
    ftSaveFeatureBtn.removeAttribute('data-ft-idx')
    ftModal.querySelector('[data-bs-dismiss="modal"]').click()
})

ftEdtSaveFeatureBtn.addEventListener('click', () => {
    const ft = listFeatures.children.item(ftEdtSaveFeatureBtn.dataset.ftIdx)
    ft.querySelector('.feature-name').innerHTML = ftEdtfeatureName.value
    ft.querySelector('.feature-answer-type').innerHTML = ftEdtAnswerType.value
    ft.querySelector('.feature-is-required').innerHTML = (ftEdtRequired.checked) ? 'Yes' : 'No'
    ftEdtModal.querySelector('[data-bs-dismiss="modal"]').click()
})


// modal: create new item
function modalCreateLi() {
    let html = `
        <input type="text" name="feature-value" class="form-control" placeholder="Value">
        <input type="number" name="feature-price" class="form-control" placeholder="Price" min="0">
        <button type="button" class="btn-close" title="Remove" onclick="removeLi(this.closest('li'))"></button>`
    let li = document.createElement('li')
    li.setAttribute('class', 'd-flex align-items-center gap-sm position-relative mb-2')
    li.innerHTML = html
    return li
}

function modalRemoveLi(li) {
    if (modalFeaturesList.childElementCount > 1) {
        modalFeaturesList.removeChild(li)
    }
}

function removeFeature(elm) {
    listFeatures.removeChild(elm)
}

function ftDelete(ftIndex, ftTargetIndex) {
    const ft = listFeatures.children.item(ftIndex)
    const ftValues = ft.querySelector('.feature-values')
    ftValues.removeChild(ftValues.children.item(ftTargetIndex))
    ftModal.querySelector('[data-bs-dismiss="modal"]').click()
}

function editFeature(elm) {
    const ftName = elm.querySelector('.feature-name').textContent
    const ftrequired = elm.querySelector('.feature-is-required').textContent
    const ftAnswerType = elm.querySelector('.feature-answer-type').textContent

    ftEdtModalLabel.innerHTML = '[Feature] '
    ftEdtModalLabel.innerHTML += elm.querySelector('.feature-name').textContent
    ftEdtModalLabel.innerHTML += ' - Edit'

    ftEdtfeatureName.value = ftName
    ftEdtAnswerType.value = ftAnswerType
    ftEdtRequired.checked = (ftrequired == 'Yes') ? true : false
    ftEdtSaveFeatureBtn.setAttribute(
        'data-ft-idx',
        Array.prototype.indexOf.call(listFeatures.children, elm)
    )
}

function modifyFt(target, action) {
    let ft = null
    let xtraTitle = ''

    if (action == ftCta.EDIT) {
        const ftValue = target.querySelector('.feature-value').textContent
        const ftPrice = target.querySelector('.feature-price').textContent
        ftFeatureName.value = ftValue
        ftFeaturePrice.value = ftPrice
        xtraTitle = ` - Edit '${ftValue}'`
        ft = target.closest('.list-features-item')
        const ftTargetIdx = Array.prototype.indexOf.call(target.closest('.feature-values').children, target)
        ftSaveFeatureBtn.setAttribute('data-ft-target-idx', ftTargetIdx)
        ftFeatureDelBtn.hidden = false
        const _ftIdx = Array.prototype.indexOf.call(listFeatures.children, ft)
        ftFeatureDelBtn.setAttribute('onclick', `ftDelete(${_ftIdx}, ${ftTargetIdx})`)
    }
    else if (action == ftCta.ADD) {
        ft = target
        xtraTitle = ` - New value`
    }
    ftModalLabel.innerHTML = '[Feature] '
    ftModalLabel.innerHTML += ft.querySelector('.feature-name').textContent
    ftModalLabel.innerHTML += xtraTitle

    const ftIdx = Array.prototype.indexOf.call(listFeatures.children, ft)
    ftSaveFeatureBtn.setAttribute('data-ft-idx', ftIdx)
    ftSaveFeatureBtn.setAttribute('data-cta', action)
}

function createFeatureValueLi(data) {
    let html = `
    <span class="flex-shrink-0 me-1 px-2 py-1">
        <span class="feature-value">${data['featureValue']}</span>
        <span class="feature-price text-muted">${data['featurePrice']}</span>
    </span>
    <div class="feature-options border-start ps-1 flex-shrink-0">
        <a role="button" class="d-block px-2 py-1" href="#" data-bs-toggle="modal" data-bs-target="#ftModal" onclick="modifyFt(this.closest('.feature-values-item'), ${ftCta.EDIT})">
            <i class="fa-solid fa-edit"></i>
        </a>
    </div>`
    let li = document.createElement('li')
    li.setAttribute('class', 'feature-values-item flex-shrink-0 border bg-light rounded-pill d-flex align-items-center p-1')
    li.innerHTML = html
    return li
}

// 2. fill UI with feature data

function addFeatureUI(data) {
    let htmlValues = ''
    data['values'].forEach(feature => {
        htmlValues += `
        <li class="feature-values-item flex-shrink-0 border bg-light rounded-pill d-flex align-items-center p-1">
            <span class="flex-shrink-0 me-1 px-2 py-1">
                <span class="feature-value">${feature['featureValue']}</span>
                <span class="feature-price text-muted">${feature['featurePrice']}</span>
            </span>
            <div class="feature-options border-start ps-1 flex-shrink-0">
                <a role="button" class="d-block px-2 py-1" href="#" data-bs-toggle="modal" data-bs-target="#ftModal" onclick="modifyFt(this.closest('.feature-values-item'), ${ftCta.EDIT})">
                    <i class="fa-solid fa-edit"></i>
                </a>
            </div>
        </li>`
    })
    let html = `
    <div class="card-body d-flex align-items-center gap-sm py-0">
        <p class="feature-name py-3 m-0 fw-bold">${data['featureName']}</p>
        <button type="button" class="btn btn-outline-success border-0 circle-sm flex-shrink-0 fs-4" title="Add feature" data-bs-toggle="modal" data-bs-target="#ftModal" onclick="modifyFt(this.closest('.list-features-item'), ${ftCta.ADD})">
            <i class="fa-solid fa-plus"></i>
        </button>
        <ul class="feature-values d-flex gap-sm overflow-auto-x py-3">${htmlValues}</ul>
    </div>
    <div class="card-footer pe-1 bg-white d-flex justify-content-between align-items-center gap-md">
        <div>
            <p class="m-0">
                <span class="text-muted">Required:</span>
                <span class="feature-is-required">${data['required']}</span>
            </p>
            <p class="m-0">
                <span class="text-muted">Answer type:</span>
                <span class="feature-answer-type">${data['answerType']}</span>
            </p>
        </div>
        <div class="btn-group dropdown">
            <button class="btn btn-outline-secondary border-0 circle-sm fs-5 dropdown-toggle no-arrow" type="button" id="dropdownMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end border-light shadow" aria-labelledby="dropdownMenu">
                <li><h6 class="dropdown-header">Options</h6></li>
                <li><a class="dropdown-item py-2 text-primary" href="#" data-bs-toggle="modal" data-bs-target="#ftEdtModal" onclick="editFeature(this.closest('.list-features-item'))">
                    <span class="me-2"><i class="fa-solid fa-edit"></i></span>
                    Edit feature
                </a></li>
                <li><a class="dropdown-item py-2 text-danger" href="#" onclick="removeFeature(this.closest('.list-features-item'))">
                    <span class="me-2"><i class="fa-solid fa-trash-can"></i></span>
                    Remove
                </a></li>
            </ul>
        </div>
    </div>`
    let li = document.createElement('li')
    li.setAttribute('class', 'list-features-item card shadow-sm mb-2')
    li.innerHTML = html
    listFeatures.appendChild(li)
}

// modal: clear input fields
function clearFields() {
    modalRequired.checked = false
    modalAnswerType.selectedIndex = 0
    modalFeatureName.value = ''
    modalFeaturesList.querySelectorAll('input[name="feature-value"]').forEach(field => {
        field.value = ''
        field.nextElementSibling.value = ''
        if (modalFeaturesList.childElementCount > 1) {
            modalFeaturesList.removeChild(field.parentElement)
        }
    })
}

function insertAfter(newElement, existingElement) {
    existingElement.parentElement.insertBefore(newElement, existingElement.nextElementSibling)
}