import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

type StateVideoContext = boolean
type SetVideoContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.disableAutoplay),
)
const setContext = React.createContext<SetContext>((_: boolean) => {})

const stateVideoContext = React.createContext<StateVideoContext>(
  Boolean(persisted.defaults.disableVideoAutoplay),
)
const setVideoContext = React.createContext<SetVideoContext>((_: boolean) => {})

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('disableAutoplay')),
  )

  const [videoState, setVideoState] = React.useState(
    Boolean(persisted.get('disableVideoAutoplay')),
  )

  const setStateWrapped = React.useCallback(
    (autoplayDisabled: persisted.Schema['disableAutoplay']) => {
      setState(Boolean(autoplayDisabled))
      persisted.write('disableAutoplay', autoplayDisabled)
    },
    [setState],
  )

  const setVideoStateWrapped = React.useCallback(
    (videoAutoplayDisabled: persisted.Schema['disableVideoAutoplay']) => {
      setVideoState(Boolean(videoAutoplayDisabled))
      persisted.write('disableVideoAutoplay', videoAutoplayDisabled)
    },
    [setVideoState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableAutoplay', nextDisableAutoplay => {
      setState(Boolean(nextDisableAutoplay))
    })
  }, [setStateWrapped])

  React.useEffect(() => {
    return persisted.onUpdate('disableVideoAutoplay', nextDisableVideoAutoplay => {
      setVideoState(Boolean(nextDisableVideoAutoplay))
    })
  }, [setVideoStateWrapped])

  return (
    <stateVideoContext.Provider value={videoState}>
      <setVideoContext.Provider value={setVideoStateWrapped}>
        <stateContext.Provider value={state}>
          <setContext.Provider value={setStateWrapped}>
            {children}
          </setContext.Provider>
        </stateContext.Provider>
      </setVideoContext.Provider>
    </stateVideoContext.Provider>
  )
}

export const useAutoplayDisabled = () => React.useContext(stateContext)
export const useSetAutoplayDisabled = () => React.useContext(setContext)

export const useVideoAutoplayDisabled = () => React.useContext(stateVideoContext)
export const useSetVideoAutoplayDisabled = () => React.useContext(setVideoContext)
