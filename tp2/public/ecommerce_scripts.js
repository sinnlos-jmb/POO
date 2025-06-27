function add_carro ()  {

    //alert (vec_prds+"\n"+JSON.stringify(vec_prds));
    const container = document.getElementById('carro');
    
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'id_producto');
    input.setAttribute('placeholder', 'ID del producto');
    //container.appendChild(input);

    input = document.createElement('select');
    input.id = 'id_producto';
    input.name = 'id_producto';

   
const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = 'Seleccionar producto';
defaultOption.disabled = true;
defaultOption.selected = true;
input.appendChild(defaultOption);

const grup1 = document.createElement('optgroup');
grup1.label = 'Calzado';
const grup2 = document.createElement('optgroup');
grup2.label = 'Campera';
const grup3 = document.createElement('optgroup');
grup3.label = 'Pantalones';


 for (let i =0; i<vec_prds.length;i++) {
  const optionElement = document.createElement('option');
  optionElement.value = vec_prds[i].id;
  optionElement.textContent = vec_prds[i].marca+", "+vec_prds[i].modelo+", $"+vec_prds[i].precio;
  
  //input.appendChild(optionElement);
  if (vec_prds[i].categoria==1) { grup1.appendChild(optionElement); }
  else if (vec_prds[i].categoria==2) { grup2.appendChild(optionElement); }
  else if (vec_prds[i].categoria==3) { grup3.appendChild(optionElement); }
}

input.appendChild(grup1);
input.appendChild(grup2);
input.appendChild(grup3);
container.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'cantidad');
    input.setAttribute('placeholder', 'cantidad');
    input.className = 'input_small';
    container.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'precio');
    container.appendChild(input);
}

function update_carro () {
  const productos = document.getElementsByName('id_producto');
  const cantidades = document.getElementsByName('cantidad');
  //const selectedOption = productos.options[productos[0].selectedIndex];
  //alert (productos[0].options[productos[0].selectedIndex].text);
  let resumen = '', total=0;
  for (let i = 0; i < productos.length; i++) {
    const prd = productos[i].value;
    const cant = cantidades[i] ? cantidades[i].value : '';
    resumen += `Producto ${i + 1}: ${prd}, Cantidad: ${cant}\n`;
    const str=productos[i].options[productos[i].selectedIndex].text;
    total+=parseInt(str.substring(str.lastIndexOf('$') + 1)*cant);
  }
  document.getElementById('total_venta').value=total;
  alert(resumen+"\ntotal: "+total);
}



function new_form(categ) {

    const container = document.getElementById('new_f');
    container.innerHTML = '';

    // Crear form
    const form = document.createElement('form');
    form.setAttribute('method', 'get');
    form.setAttribute('action', '/productos')

    // Crear inputs
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'marca');
    input.setAttribute('placeholder', 'Marca del producto');
    input.className = 'input_l';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'modelo');
    input.setAttribute('placeholder', 'Modelo del producto');
    input.className = 'input_l';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'precio');
    input.setAttribute('placeholder', 'Precio');
    input.className = 'input_small';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'stock');
    input.setAttribute('placeholder', 'Stock');
    input.className = 'input_small';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'categ');
    input.setAttribute('value', categ);
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'op');
    input.setAttribute('value', 'submit');
    form.appendChild(input);

    if (categ==1) {
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'material');
        input.setAttribute('placeholder', 'Material');
        input.className = 'input_l';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'talles');
        input.setAttribute('placeholder', 'Talles');
        input.className = 'input_l';
        form.appendChild(input);    

        }
    else if (categ==2) {  //campera
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'talles');
        input.setAttribute('placeholder', 'Talles');
        input.className = 'input_l';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'temporada');
        input.setAttribute('placeholder', 'Temporada');
        input.className = 'input_l';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'color');
        input.setAttribute('placeholder', 'Color');
        input.className = 'input_l';
        form.appendChild(input);

        }
    else if (categ==3) { //pantalon
        form.appendChild(document.createElement('br'));
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'ancho');
        input.setAttribute('placeholder', 'Ancho');
        input.className = 'input_small';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'largo');
        input.setAttribute('placeholder', 'largo');
        input.className = 'input_small';
        form.appendChild(input);        
        }
    else {
        container.innerHTML = '';
        return;
    }

    // submit 
    const submit = document.createElement('button');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'Submit';
    submit.className = 'submit_btn';

    form.appendChild(submit);

    container.appendChild(form);
}