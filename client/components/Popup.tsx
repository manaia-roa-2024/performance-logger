import { useEffect, ReactNode } from 'react'
import cls from './SimpleForm/cls'

interface Props {
  children?: ReactNode,
  className?: string,
  id: string,
  onClose?: () => void
}

export const GenericPopup = ({children, className, id, onClose}: Props) => {
    useEffect(() =>{
        const popup = document.getElementById(id)! as HTMLDialogElement
        popup.addEventListener('open', () =>{
        })
        document.addEventListener("mousedown", e =>{
            if (e.target === popup && e.button === 0){
                popup.close()
                if (typeof(onClose) === 'function'){
                    onClose()
                }
            }
        })

    }, [])
  return (
    <dialog className={cls(className, 'bp-popup')} id={id} tabIndex={-1}>
        <div className='popup-content-container'>
            {children} 
        </div>
    </dialog>
  )
}
