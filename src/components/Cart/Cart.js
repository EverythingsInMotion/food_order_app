import React, { useContext, useState } from 'react';
import classes from './Cart.module.css'
import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context'
import CartItem from './CartItem'
import Checkout from './Checkout';


const Cart = (props) => {
    const cartCtx = useContext(CartContext);
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems = cartCtx.items.length > 0;

    const cartRemoveItemHandler = id => { cartCtx.removeItem(id) }

    const cartAddItemHandler = item => {
        // const cartItem = { ...item, amount: 1 }
        cartCtx.addItem({ ...item, amount: 1 })
    }

    const orderHandler = () => {
        setIsCheckout(true)
    }

    const submitOrderHandle = async (userData) => {
        setIsSubmitting(true);
        await fetch("https://react-http-f3cfa-default-rtdb.firebaseio.com/orders.json", {
            method: "POST",
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items
            })
        })
        setIsSubmitting(false)
        setDidSubmit(true);
        cartCtx.clearCart();
    }

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map(item => (
                <CartItem
                    key={item.id}
                    amount={item.amount}
                    name={item.name}
                    price={item.price}
                    onRemove={cartRemoveItemHandler.bind(null, item.id)}
                    onAdd={cartAddItemHandler.bind(null, item)} />
            )
            )}
        </ul>)

    const modalAction = (<div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onCloseCart}>
            Close
        </button>
        {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
    </div>)

    const cartModalContent =
        <>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onCancel={props.onCloseCart} onFormSubmit={submitOrderHandle} />}
            {!isCheckout && modalAction}
        </>

    const isSubmittingModalContent =
        <>
            <p>Sending order data..</p>
        </>

    const didSubmitModalContent =

        <>
            <p>Order submitted succesfully.</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onClose}>Close
                </button>
            </div>
        </>

    return (
        <Modal onClick={props.onCloseCart}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    )
};

export default Cart;