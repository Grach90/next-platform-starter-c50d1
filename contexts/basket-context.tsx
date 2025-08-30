"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { IBasketItem } from "@/lib/types"

interface BasketState {
  items: IBasketItem[]
  isOpen: boolean
}

type BasketAction =
  | { type: "ADD_ITEM"; payload: IBasketItem }
  | { type: "REMOVE_ITEM"; payload: { flowerId: string; size: number } }
  | { type: "UPDATE_QUANTITY"; payload: { flowerId: string; size: number; quantity: number } }
  | { type: "CLEAR_BASKET" }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "LOAD_BASKET"; payload: IBasketItem[] }

interface BasketContextType {
  state: BasketState
  addItem: (item: IBasketItem) => void
  removeItem: (flowerId: string, size: number) => void
  updateQuantity: (flowerId: string, size: number, quantity: number) => void
  clearBasket: () => void
  setOpen: (open: boolean) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

const basketReducer = (state: BasketState, action: BasketAction): BasketState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.flowerId === action.payload.flowerId && item.size === action.payload.size,
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems }
      } else {
        // Add new item
        return { ...state, items: [...state.items, action.payload] }
      }
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.flowerId === action.payload.flowerId && item.size === action.payload.size),
        ),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.flowerId === action.payload.flowerId && item.size === action.payload.size),
          ),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.flowerId === action.payload.flowerId && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    }

    case "CLEAR_BASKET":
      return { ...state, items: [] }

    case "SET_OPEN":
      return { ...state, isOpen: action.payload }

    case "LOAD_BASKET":
      return { ...state, items: action.payload }

    default:
      return state
  }
}

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, {
    items: [],
    isOpen: false,
  })

  // Load basket from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem("flower-basket")
    if (savedBasket) {
      try {
        const items = JSON.parse(savedBasket)
        dispatch({ type: "LOAD_BASKET", payload: items })
      } catch (error) {
        console.error("Error loading basket from localStorage:", error)
      }
    }
  }, [])

  // Save basket to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("flower-basket", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: IBasketItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (flowerId: string, size: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { flowerId, size } })
  }

  const updateQuantity = (flowerId: string, size: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { flowerId, size, quantity } })
  }

  const clearBasket = () => {
    dispatch({ type: "CLEAR_BASKET" })
  }

  const setOpen = (open: boolean) => {
    dispatch({ type: "SET_OPEN", payload: open })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const value: BasketContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearBasket,
    setOpen,
    getTotalItems,
    getTotalPrice,
  }

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider")
  }
  return context
}
