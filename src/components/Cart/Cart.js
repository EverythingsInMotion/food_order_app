import React, { useContext } from 'react';
import classes from './Cart.module.css'
import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context'
import CartItem from './CartItem'


const Cart = (props) => {
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems = cartCtx.items.length > 0;

    const cartRemoveItemHandler = id => { cartCtx.removeItem(id) }

    const cartAddItemHandler = item => {
        // const cartItem = { ...item, amount: 1 }
        cartCtx.addItem({ ...item, amount: 1 })
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


    return (
        <Modal onClick={props.onCloseCart}>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            <div className={classes.actions}>
                <button className={classes['button--alt']} onClick={props.onCloseCart}>
                    Close
                </button>
                {hasItems && <button className={classes.button}>Order</button>}
            </div>
        </Modal>
    )
};

export default Cart;