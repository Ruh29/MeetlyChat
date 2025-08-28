import React from 'react'

function Card({ title,desc,button,onClick }) {

  return (
    < >
      <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
      {button && (
        <button
          onClick={onClick}
          className="mt-3 px-3 py-1 bg-indigo-600 text-white rounded text-sm"
        >
          {button}
        </button>
      )}
    </div>
    </>
  )
}

export default Card