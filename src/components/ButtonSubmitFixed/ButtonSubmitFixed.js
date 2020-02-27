import React, { Component } from 'react'

function ButtonSubmitFixed() {
    return (
        <div className="fixed bottom-0 right-0 px-6">
            <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                <input
                    id="form-submit"
                    className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline"
                    type="submit"
                    value="Opslaan"
                ></input>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
