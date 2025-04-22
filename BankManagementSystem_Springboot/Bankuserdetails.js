      async function fetchBankUserDetails() {
        try {
            
            const response = await fetch('http://localhost:9090/userstatusaccepted');
           
            const data = await response.json();

          UserTable(data);
         
        } catch (error) {
            console.error('Error in fetchPendingDetails:', error); 
       
           }
        }


        document.getElementById('searchButton').addEventListener('click', () => {
            const searchbyString = document.getElementById('searchbyString').value.trim();
            if (searchbyString) {
                searchUser(searchbyString);
            } else {
                fetchBankUserDetails(); 
            }
        });

        async function searchUser(searchbyString) {
            try {

                 const     url = `http://localhost:9090/searchbyString/${encodeURIComponent(searchbyString)}`;
        //         let url;
        //   if (Number(sebyString)) {
        //     url = `http://localhost:9090/searchbyNumber/${encodeURIComponent(searchbyString)}`;
            
        //    } else {
            
        //     url = `http://localhost:9090/searchbyString/${encodeURIComponent(searchbyString)}`;
         
        //    }
      

                const userDetails = await fetch(url);
                const data = await userDetails.json();
                
                UserTable(data);
                
                localStorage.setItem("AlluserDetails", JSON.stringify(data));
             
            } catch (error) {
                console.error('Error in searchUser :', error);
            }
        }
      



    function UserTable(data){       
  const tableBody = document.querySelector('#usertable tbody');
     tableBody.innerHTML = '';
     const users = Array.isArray(data) ? data : (data.data || data.content || data.users || []);      
      users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td  id="userupdateid">${user.id || ''}</td>
                 
                    <td  contenteditable="true" >${user.name}</td>
                    <td  contenteditable="true"  >${user.emailid}</td>
                    <td   contenteditable="true" >${user.phonenumber}</td>
                    <td  contenteditable="true" >${user.aadharnumber}</td>
                    <td contenteditable="true" >${user.panumber}</td>
                    <td >${user.accountnumber}</td>
                    <td contenteditable="true" >${user.address}</td>
                    <td   contenteditable="true" >${user.dateofbirth}</td>
                    <td >${user.ifsccode}</td>
                    
                    <td><button onclick="UpdateDetails(${user.id})">Update</button>
                    <button onclick="CheckTransaction(${user.accountnumber})">Check Transaction</button></td>
                    
                `;
                tableBody.appendChild(row);
            });
        }
    async function UpdateDetails(userId) {
        
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(el => el.textContent = '');
        let isValid = true;

        const rows = document.querySelectorAll('#usertable tbody tr');
        let row = null;
    
        rows.forEach(r => {
            if (r.cells[0].textContent.trim() === userId.toString()) {
                row = r; 
            }
        });
    
     const updatedData={
        name: row.cells[1] ? row.cells[1].textContent : '',
        emailid: row.cells[2] ? row.cells[2].textContent : '',
        phonenumber: row.cells[3] ? row.cells[3].textContent : '',
        aadharnumber: row.cells[4] ? row.cells[4].textContent : '',
        panumber: row.cells[5] ? row.cells[5].textContent : '',
        address: row.cells[7] ? row.cells[7].textContent : '',
        dateofbirth: row.cells[8] ? row.cells[8].textContent : '',
    };           
   if (updatedData.name.length < 2) {
     document.getElementById('updateError').textContent = 'Name must be at least 2 characters long';
       isValid = false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(updatedData.emailid)) {
        document.getElementById('updateError').textContent = 'invalid Emailid';
          isValid = false;
       }
   

       if (!/^[6-9]\d{9}$/.test(updatedData.phonenumber)) {
        document.getElementById('updateError').textContent = 'Mobile number must be 10 digits starting with 6-9';
          isValid = false;
       }
       if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(updatedData.panumber)) {
        document.getElementById('updateError').textContent = 'invalid Emailids';
          isValid = false;
       }
   if (!/^\d{12}$/.test(updatedData.aadharnumber)) {
        document.getElementById('updateError').textContent = 'aadharnumber must be 12 digits';
          isValid = false;
       }
    if(!isValid) return;
    console.log(updatedData);
    try {
        const response = await fetch(`http://localhost:9090/updateUserDetailsinadminlogin/${userId}`, {
            method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(updatedData)
    });
    const result = await response.json();
    
            if (result.httstatuscode === 200) {
                
                document.getElementById('updateError').textContent = 'User updated successfully';
                
                
            } else {
                
                document.getElementById('updateError').textContent = 'Failed to  updated ';
             }        
        }catch(error){
        console.error('Error updateing user:', error);
            
            document.getElementById('updateError').textContent = 'Error updateing user ';
              
             }
    }

   async function CheckTransaction(userAccountnumber){
        const response = await fetch(`http://localhost:9090/userBankTranstion/${userAccountnumber}`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
            });
            const result = await response.json();
            console.log(result);
            if(result.httstatuscode === 200){
                // window.open("UserCheckStatement.html", "_blank");
        }
     }


















    document.addEventListener('DOMContentLoaded', () => {
        
        fetchBankUserDetails();
    });
