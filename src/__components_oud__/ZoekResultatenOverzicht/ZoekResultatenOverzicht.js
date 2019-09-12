import React, { Component } from 'react'
import BackToButton from './../UI/BackToButton'

class ZoekResultatenOverzicht extends Component {
    render() {
        return (
            <div className="container mx-auto flex px-6 pb-8 mt-12">
                <div className="w-1/4">
                    <BackToButton terugNaar="startpagina" url="/" />
                    <h2 className="mt-6 text-l font-serif block">Filteren</h2>
                    <ul className="mt-4">
                        <li className="mt-1 text-gray-700 text-sm">
                            <label className="cursor-pointer select-none">
                                <input
                                    class="mr-2 leading-tight"
                                    type="checkbox"
                                />
                                <span>Visie (9)</span>
                            </label>
                            <ul>
                                <li className="pl-6 mt-1 text-gray-700 text-sm">
                                    <label className="cursor-pointer select-none">
                                        <input
                                            class="mr-2 leading-tight"
                                            type="checkbox"
                                        />
                                        <span>Ambities (1)</span>
                                    </label>
                                </li>
                                <li className="pl-6 mt-1 text-gray-700 text-sm">
                                    <label className="cursor-pointer select-none">
                                        <input
                                            class="mr-2 leading-tight"
                                            type="checkbox"
                                        />
                                        <span>Beleidsopgaven (2)</span>
                                    </label>
                                </li>
                                <li className="pl-6 mt-1 text-gray-700 text-sm">
                                    <label className="cursor-pointer select-none">
                                        <input
                                            class="mr-2 leading-tight"
                                            type="checkbox"
                                        />
                                        <span>Beleidsbeslissingen (6)</span>
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li className="mt-1 text-gray-700 text-sm">
                            <label className="cursor-pointer select-none">
                                <input
                                    class="mr-2 leading-tight"
                                    type="checkbox"
                                />
                                <span>Verordening (4)</span>
                            </label>
                        </li>
                        <li className="mt-1 text-gray-700 text-sm">
                            <label className="cursor-pointer select-none">
                                <input
                                    class="mr-2 leading-tight"
                                    type="checkbox"
                                />
                                <span>Programma (2)</span>
                            </label>
                        </li>
                    </ul>
                </div>

                <div className="w-2/4">
                    <span className="text-gray-600 text-sm">
                        Zoekresultaten voor "Lucht"
                    </span>
                    <ul>
                        <li className="border-b border-gray-300 py-6">
                            <h2 className="text-l font-serif block text-gray-800">
                                Artikel 1.2 · Toepassingsgebied
                            </h2>
                            <p className="mt-3 text-gray-700 text-sm">
                                ...lorem ipsum dolor sit amet,{' '}
                                <mark className="bg-yellow-200 text-gray-800">
                                    consectetur
                                </mark>{' '}
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </p>
                        </li>
                        <li className="border-b border-gray-300 py-6">
                            <h2 className="text-l font-serif block text-gray-800">
                                Artikel 1.2 · Toepassingsgebied
                            </h2>
                            <p className="mt-3 text-gray-700 text-sm">
                                ...lorem ipsum dolor sit amet,{' '}
                                <mark className="bg-yellow-200 text-gray-800">
                                    consectetur
                                </mark>{' '}
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default ZoekResultatenOverzicht
