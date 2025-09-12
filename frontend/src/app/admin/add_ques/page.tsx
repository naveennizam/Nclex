'use client'

import { useEffect, useState } from 'react'
import QuizForm from './QuizForm'
import HighlightForm from './HighlightForm'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [inputValue, setInputValue] = useState('Single')

  const handleChange = (e: any) => setInputValue(e.target.value)

  useEffect(() => { }, [inputValue])
  return (
    <section className='mx-5 container'>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add Questions</h1>
      </div>

      <section >
        <p>Select Questions type: </p>
        <div className="radio-group">
        <label>
          <input type='radio' value="Single" name='QuesType' onChange={handleChange} checked={inputValue == 'Single'} />
          Single
        </label>
        <label>
          <input type='radio' value="Multiple" name='QuesType' onChange={handleChange} checked={inputValue == 'Multiple'} />
          Multiple
        </label>
        <label>
          <input type='radio' value="Highlight" name='QuesType' onChange={handleChange} checked={inputValue == 'Highlight'} />
          Highlight
        </label>
        <label>
          <input type='radio' value="Drag" name='QuesType' onChange={handleChange} checked={inputValue == 'Drag'} />
          Drag
        </label>
        </div>
      </section>



      <section>

        {inputValue == 'Single' &&
          <div>
              <h2 className='text-center'>Single</h2>
           <QuizForm type='Single'/>
          </div>
        }

        {inputValue == 'Multiple' &&
          <div>
            <h2 className='text-center'>Multiple</h2>
            <QuizForm type='Multiple'/>
          </div>
        }

        {inputValue == 'Highlight' &&
          <div>
            <h2 className='text-center'>Highlight</h2>
            <HighlightForm/>
          </div>
        }

        {inputValue == 'Drag' &&
          <div>
            <h2 className='text-center'>Drag</h2>
            <QuizForm type='Drag'/>
          </div>
        }
      </section>

    </section>


  )
}
