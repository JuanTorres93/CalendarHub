 export function handleListSelection(list, itemSelector, onSelect, closeDropDownClass){
    list.addEventListener("click", (e)=>{
        e.stopPropagation()
     const item = e.target.closest(itemSelector)
        if (!item) return       

        onSelect(item)

        list.classList.remove(closeDropDownClass)
    })
}


export function handleOutSideClick(selector, list, className){
    document.addEventListener("click", (e) => {
        const inside = e.target.closest(selector)
        if(!inside){
            list.classList.remove(className)
        }
    })
}
