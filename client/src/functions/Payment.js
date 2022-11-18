import axios from "axios";

export const loadScript=(src)=>{
    return new Promise((resolve)=>{
        const script=document.createElement('script');

        script.src=src;
        script.onload=()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false);
        }
        document.body.appendChild(script)
    })
}

const bookRooms=async(selectedRooms,alldates)=>{
    await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`https://bookingo.herokuapp.com/api/rooms/availability/${roomId}`,{
            dates: alldates,
          });
          return res.data;
        })
      );
  }

export async function displayRazorpay(data,setsuccess,selectedRooms,alldates){
    const options={
        key:"rzp_test_gjARfUjUfUjwU8",
        currency:data.currency,
        amount:data.amount,
        description:"Wallet Transection",
        order_id:data.id,
        handler:function(res){
            setsuccess(1);
            bookRooms(selectedRooms)
            console.log(res);
        },
        prefill:{
            name:"AMAN GUPTA",
            email:"techupdate4529@gmail.com",
            contact:"9179271036"
        }
     };
     
    const paymentObject=new window.Razorpay(options)
    paymentObject.on("payment.failed",()=>{
        console.log("failed");
        setsuccess(-1);
    })
paymentObject.open();


}

