
let bookName = document.getElementsByClassName('bookName')
//
let category = document.getElementsByClassName('category')
//
let price = document.getElementsByClassName('price')
let del = document.getElementsByClassName('delete')
let update= document.getElementsByClassName('update')



// let completion = document.getElementsByClassName('complete');
// let deletionComplete= document.querySelectorAll('tbody tr td')


Array.from(update).forEach(function(element) {
      element.addEventListener('click', function(){
        const bookName = this.parentNode.parentNode.childNodes[1].innerText
        const category = this.parentNode.parentNode.childNodes[3].innerText
        const price = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('bookInput', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'price': price,
            'bookName': bookName,
            'category': category,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          // window.location.reload(true)
        })
      });
});


Array.from(del).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(del)
        const bookName = this.parentNode.parentNode.childNodes[1].innerText
        const category = this.parentNode.parentNode.childNodes[3].innerText
        const price = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        // const deletionComplete=this.parentNode.parentNode.remove().textContent
       //   const personName= this.parentNode.parentNode.childNodes[1].childNodes[0].innerText
       //   const when=
       //   this.parentNode.parentNode.childNodes[1].childNodes[2].innerText
       // const phoneNumber = this.parentNode.parentNode.childNodes[1].childNodes[4].innerText

// });
        fetch('bookInput', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'bookName': bookName,
            'category': category,
            'price': price,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
