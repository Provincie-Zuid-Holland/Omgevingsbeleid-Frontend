import React, { Component } from 'react'

function ButtonSubmitFixed({ saving }) {
    return (
        <div className="fixed bottom-0 right-0 px-6">
            <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                <button
                    id="form-submit"
                    className="font-bold cursor-pointer py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline"
                    type="submit"
                >
                    Opslaan
                </button>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
