import React, { ChangeEvent, FunctionComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

type InputProps  ={
    title: string,
    type: string,
    name: string,
    id: string,
    disabled?: string,
    placeholder: string,
    errorMessage?: string,
    setValue: any,
    tipdata: string,
    reference?: string
}



export const PasswordInput: FunctionComponent<InputProps> = ({
    type,
    name,
    title,
    id,
    disabled,
    placeholder,
    errorMessage,
    setValue,
    tipdata,
    reference,
}) => {
    return (
        <>
            <label
                data-tip={tipdata}
                className={` ${tipdata && `tooltip`} text-gray-700 font-medium text-sm`}
            >
                {title}
                {tipdata && <span className="tooltip"></span>}

                {errorMessage && <span className="text-red-500 required-dot">*</span>}
            </label>
            <input
                className={`${disabled ? `bg-gray-100 text-gray-400` : `text-gray-700`
                    } ${errorMessage && `ring-red-500`
                    } rounded-md flex-1 border-solid ring-red-900 ring-inset w-full mt-0.5 text-sm h-8 px-2 bg-white placeholder-gray-400 shadow-sm active:border-blue-600`}
                type={type}
                name={name}
                id={id}
                ref={reference}
                placeholder={placeholder}
                onChange={(e: ChangeEvent) => setValue(e)}
            />
            {errorMessage && (
                <>
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="absolute text-red-500 right-2 mt-3"
                    />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                </>
            )}
        </>
    )
}
