
//per funzionare e far si che che io voglia inserire un innerHTML invece che l'inner Text, option deve contere html come truty
function createElement(father, elClass, el, tag, options = {}){
    const container = document.createElement(tag)
    if(elClass) container.classList.add(elClass)

    if(options.html){
        container.innerHTML = el;
    } else {
        container.innerText = el;
    }
   
    if(options.dataset){
        Object.entries(options.dataset).forEach(([key, value]) =>{
            container.dataset[key] = value
        })
    }
    if(options.attributes){
      Object.entries(options.attributes).forEach(([key, value]) => {
        container.setAttribute(key, value)
      })
    }

    father.appendChild(container)
    return container
}


export function createMessage(message, container, father, type){
  const containerRect = container.getBoundingClientRect()
  const fatherRect = father.getBoundingClientRect()

 const  top = containerRect.top - fatherRect.top
 const  left = containerRect.left - fatherRect.left

    const alert = createElement(
      father,
      "missing-info-alert",
        message,
      "p",
      { attributes: { "data-testid": "info-alert" } }
    )
    setTimeout(()=>{
      alert.remove()
    }, 2000)
    const alertHeight = alert.getBoundingClientRect().height
    const alertWidth = alert.getBoundingClientRect().width

     alert.style.top = `${top - alertHeight*0.5}px`
    alert.style.left = `${left}px`

}



export default createElement