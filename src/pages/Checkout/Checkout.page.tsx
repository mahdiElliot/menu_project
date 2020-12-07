import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
} from "@stripe/stripe-js";
import { useSnackbar } from "notistack";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

import { CartDetails } from "../Cart/Cart.page";

import Backable from "../../layouts/Backable/Backable.layout";

import TextField from "../../components/Inputs/TextField/TextField.input";
import RadioGroup from "../../components/Inputs/RadioGroup.input";
import { PrimaryCheckbox } from "../../components/Inputs/CheckBox";

import { useBusiness } from "../../hooks/useBusiness";
import { useFetchOne } from "../../hooks/UseFetchOne";
import { useCart } from "../../hooks/useCart";
import { usePlaceOrder } from "../../hooks/usePlaceOrder";

import { Business, BusinessFns, Zone } from "../../models/Business.model";
import { PayMethod, paymethodService } from "../../models/PayMethods.model";
import { Cart, CartFns } from "../../models/Cart.model";
import { Order } from "../../models/Order.model";

import { show } from "../../utils/show.util";
import { filterOrElse } from "../../utils";
import { BusinessNotAvailableError } from "../../functions/Errors.Fns";
import { handleErrors } from "../../utils/Errors.view";

import "./Checkout.page.style.scss";

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

type Inputs = {
  name: string;
  email: string;
  telephone: string;
  table: string;
  paymethod: string;
  comment: string;
};

const delivery_type = "1";

const getPayMethod = (payMethods: PayMethod[], name: string) => {
  return payMethods.find((x) => x.paymethod.name.toLowerCase() === name.toLowerCase()) as PayMethod;
};

const createProductsObject = (cart: Record<string, Cart>) =>
  Object.values(cart).map((x) => ({
    comment: x.comment,
    id: x.product.id,
    options: Object.keys(x.extra).map((k) => ({
      id: Number(k),
      suboptions: x.extra[Number(k)].suboptions.map((y) => y.id),
    })),
    quantity: x.quantity,
  }));
const Checkout = ({
  business,
  paymethods,
  zoneId,
}: {
  business: Business;
  paymethods: PayMethod[];
  zoneId: number;
}) => {
  const { control, handleSubmit, watch } = useForm<Inputs>({
    mode: "onChange",
  });
  const elements = useElements();
  const stripe = useStripe();
  const { enqueueSnackbar } = useSnackbar();

  const [paymethod, setPaymethod] = React.useState("");

  const history = useHistory();

  const [tip, setTip] = React.useState("0");
  const [serviceTip, setServiceTip] = React.useState("0");
  const [stripeError, setStripeError] = React.useState<StripeCardElementChangeEvent["error"]>(
    undefined
  );
  const [stripeCompleted, setStripeCompleted] = React.useState(false);
  const [last4, setLast4] = React.useState<string | undefined>("");
  const [cardType, setCardType] = React.useState<string | undefined | null>("");
  const [isUserAgreed, setUserAgreed] = React.useState(false);

  const { data, loading, placeOrder, getStripeDirectToken, setLoading } = usePlaceOrder();
  const { menuId } = useBusiness();

  const { cart, clearCart } = useCart();

  const totalPriceInCart = useMemo(() => CartFns.cartPrice(cart), [cart]);

  const onSubmit = async ({ name, email, telephone, table, comment }: Inputs) => {
    const { paymethod_id } = getPayMethod(paymethods, paymethod);

    const customer = {
      name,
      email,
      id: -1,
      cellphone: telephone,
      address: `Table ${table}`,
      address_notes: comment,
      tag: "other",
    };
    const products = createProductsObject(cart);

    const card = elements?.getElement(CardElement);
    let stripeToken;

    if (!isUserAgreed) {
      return;
    }

    if (card) {
      setLoading(true);
      const stripeResult = await stripe?.createToken(card);
      setLoading(false);

      setLast4(stripeResult?.token?.card?.last4);
      setCardType(stripeResult?.token?.card?.brand);

      if (stripeResult?.error || !stripeResult?.token) {
        enqueueSnackbar("Something wrong with payment :(", {
          variant: "error",
          autoHideDuration: 2000,
          disableWindowBlurListener: true,
        });
        return;
      }

      await getStripeDirectToken(stripeResult.token.id, {
        customer: JSON.stringify(customer),
        amount: BusinessFns.prices(totalPriceInCart, [{ price: serviceTip }])(business).total,
        currency: business.currency,
        description: `Order To ${business.name}`,
        business_id: business.id,
      })
        .then((t) => {
          stripeToken = t;
        })
        .catch((e: Error) =>
          enqueueSnackbar(e.message, {
            variant: "error",
            autoHideDuration: 2000,
            disableWindowBlurListener: true,
          })
        );

      if (!stripeToken) {
        return;
      }
    }

    if (paymethod_id) {
      const orderObject = {
        paymethod_id,
        business_id: business?.id ?? 0,
        delivery_type,
        driver_tip: Number(tip),
        delivery_zone_id: zoneId,
        location: business.location,
        pay_data: stripeToken,
        products: JSON.stringify(products),
        customer: JSON.stringify({ ...customer, location: business.location }),
      };
      placeOrder(orderObject);
    }
  };

  const handleChange = (data: any) => setPaymethod(data);
  const handleTipChange = (data: any) => setTip(data);

  const onChangeCard = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setStripeError(e.error);
    } else if (e.complete) {
      setStripeCompleted(true);
      setStripeError(undefined);
    }
  };

  useEffect(() => {
    setStripeCompleted(false);
  }, [paymethod]);

  useEffect(() => {
    if (tip) {
      setServiceTip(((Number(tip) * totalPriceInCart) / 100).toFixed(2));
    }
  }, [tip, totalPriceInCart]);

  useEffect(() => {
    if (!loading && data) {
      clearCart();
      history.push(`/confirmation?order_id=${data?.id}`, {
        menuId,
        last4,
        cardType,
        order: Order.decode(data),
      });
    }
  }, [data, loading, last4, cardType, menuId, history, clearCart]);
  return (
    <Backable>
      <>
        <form autoComplete="on" onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="inputs">
            <h2>User Details</h2>
            <TextField
              className="inputs__input"
              name="table"
              label="Table"
              control={control}
              rules={{ required: true }}
              margin="dense"
            />
            <TextField
              className="inputs__input"
              label="Name"
              name="name"
              role="first name"
              control={control}
              margin="dense"
            />
            <TextField
              margin="dense"
              className="inputs__input"
              label="Phone"
              name="telephone"
              control={control}
            />
            <TextField
              margin="dense"
              className="inputs__input"
              label="Add Email"
              name="email"
              buttoned
              buttonLabel="Receive Email Receipt"
              control={control}
            />
            <TextField
              className="inputs__input"
              label="Comment"
              name="comment"
              multiline
              rows={3}
              buttoned
              buttonLabel="comment"
              control={control}
            />
          </div>
          {paymethods.length > 0 && (
            <div className="paymethods">
              <h2>Select a Payment Method</h2>
              <RadioGroup
                name="pay methods"
                value={paymethod}
                control={control}
                onChange={(x) => handleChange(x.target.value)}
                options={paymethods.map((p) => ({
                  value: p.paymethod.name,
                  label: p.paymethod.name === "Stripe Direct" ? "Credit Card" : p.paymethod.name,
                }))}
              />
            </div>
          )}
          {paymethod === "Stripe Direct" && (
            <CardElement id="card" options={CARD_ELEMENT_OPTIONS} onChange={onChangeCard} />
          )}
          <div className="service-tip">
            <h2>Service Tip</h2>
            <RadioGroup
              name="serviceTip"
              value={tip}
              control={control}
              onChange={(x) => handleTipChange(x.target.value)}
              options={[
                { label: "0%", value: "0" },
                { label: "10%", value: "10" },
                { label: "15%", value: "15" },
                { label: "20%", value: "20" },
                { label: "25%", value: "25" },
              ]}
            />
          </div>
          <div>
            <CartDetails
              editable={false}
              moreDetails={[{ title: "Service Tip", price: serviceTip }]}
            />
          </div>
          <div className="terms" onClick={() => setUserAgreed(!isUserAgreed)}>
            <PrimaryCheckbox
              checked={isUserAgreed}
              name="terms"
              onChange={(x) => setUserAgreed(x.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.persacart.com/pages/privacy"
              >
                Privacy Policy{" "}
              </a>
              and{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.persacart.com/pages/terms"
              >
                Terms of Use
              </a>
            </span>
          </div>
          <Button
            type="submit"
            className="submit"
            disabled={
              !watch("table") ||
              (paymethod === "Stripe Direct" && (!!stripeError || !stripeCompleted)) ||
              !isUserAgreed ||
              paymethod.length === 0
            }
          >
            {loading ? <CircularProgress size={23} style={{ color: "white" }} /> : "Place Order"}
          </Button>
        </form>
      </>
    </Backable>
  );
};
const CheckoutPage = ({ business }: { business: Business }) => {
  const paymethods = useMemo(() => BusinessFns.getPayMethods(business), [business]);
  const stripePromise = useMemo(
    () =>
      pipe(
        paymethods,
        A.findFirst((x) => x.paymethod.name === "Stripe Direct"),
        O.map(paymethodService.getPublishable),
        O.map((x) => loadStripe(x)),
        O.toNullable
      ),
    [paymethods]
  );

  return pipe(
    BusinessFns.getMinimumPriceZoneId(business.zones),
    O.fold(
      () => handleErrors(BusinessNotAvailableError()),
      (x) => (
        <Elements stripe={stripePromise}>
          <Checkout zoneId={x} business={business} paymethods={paymethods} />
        </Elements>
      )
    )
  );
};

const CheckoutPageContainer = () => {
  const { businessId } = useBusiness();
  return pipe(
    useFetchOne("Business", { id: businessId }),
    filterOrElse((x) => !A.isEmpty<Zone>(x.zones), BusinessNotAvailableError),
    show((x) => <CheckoutPage business={x} />)
  );
};

export default CheckoutPageContainer;
