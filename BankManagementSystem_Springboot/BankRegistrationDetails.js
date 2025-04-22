async function fetchPendingDetails() {
    try {
        
        const response = await fetch('http://localhost:9090/userpendingdetails');
        // console.log('Response received:', response);
        const data = await response.json();
        if(data===null){
            alert("there no details");
            return;
        }
        // console.log('Parsed data:', data);  
        // console.log('Data properties:', Object.keys(data));
        const tableBody = document.querySelector('#usertable tbody');
        tableBody.innerHTML = '';
        const users = Array.isArray(data) ? data : (data.data || data.content || data.users || []);
        

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id || ''}</td>
                <td>${user.name || ''}</td>
                <td>${user.emailid || ''}</td>
                <td>${user.phonenumber || ''}</td>
                <td><button onclick="acceptDetails('${user.id}')">Accept</button>
                    <button onclick="RejectDetails('${user.id}')">Reject</button></td>
                
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error in fetchPendingDetails:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, fetching data...');
    fetchPendingDetails();
});
//reject by id

async function RejectDetails(Id) {
    
    try {  
        const response = await fetch(`http://localhost:9090/rejectdetailsinvalid/${Id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response)=response.json())
          .then((data)=>{
        if (data.httstatuscode === 410) {
            alert('User rejected successfully');
            fetchPendingDetails().reset();
        } else {
            alert('Failed to reject user');


              }
            
       });
    
  } catch (error) {
        console.error('Error rejecting user:', error);
        alert('Error rejecting user');
        fetchPendingDetails().reset();
    }
}
//ACcepting 
async function acceptDetails(Id) {
    try {
        const response = await fetch(`http://localhost:9090/accountnumberandpin/${Id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.httstatuscode === 202) {
            alert('User accepted successfully');
            fetchPendingDetails().reset();
        } else {
            alert('Failed to axcepting user');
            
        }
    } catch (error) {
        console.error('Error accepting user:', error);
        alert('Error accepting user');
        fetchPendingDetails().reset();
        
    }
}



