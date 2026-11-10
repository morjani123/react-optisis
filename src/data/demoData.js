import { uid, nowISO } from '../utils/storage'

// Entirely fictional sample records for the public portfolio demo.
export function createDemoData() {
  const stamp = nowISO()
  const clientNames = [
    ['Youssef','Amrani','Fès'],['Sara','El Idrissi','Rabat'],['Hamza','Bennani','Casablanca'],
    ['Imane','Alaoui','Meknès'],['Othmane','Ziani','Tanger'],['Salma','Fassi','Fès'],
    ['Ayoub','Chraibi','Marrakech'],['Nadia','Berrada','Agadir'],['Anas','Mansouri','Kénitra'],
    ['Meryem','Tazi','Fès'],['Rania','Kabbaj','Rabat'],['Mehdi','Saidi','Casablanca']
  ]
  const clients = clientNames.map(([firstName,lastName,address],i)=>({
    id:uid('cli_'),firstName,lastName,address,phone:'060000'+String(1000+i),
    gender:['Homme','Femme'][i%2],age:22+(i*3)%38,email:'client'+(i+1)+'@example.com',createdAt:stamp
  }))
  const supplierNames = ['Optique Atlas Démo','Vision Distribution Démo','Cristal Optique Démo','Lentilles Pro Démo']
  const suppliers = supplierNames.map((name,i)=>({
    id:uid('sup_'),name,phone:'050000'+String(1000+i),email:'contact'+i+'@example.com',
    address:['Fès','Casablanca','Rabat','Tanger'][i],createdAt:stamp
  }))
  const brands = ['Ray-Ban','Vogue','Carrera','Polaroid','Oakley','Guess','Hugo Boss','Persol','Lacoste','Tommy Hilfiger']
  const frames = brands.map((brand,i)=>({
    id:uid('fra_'),ref:'OPT-DEMO-'+String(i+1).padStart(3,'0'),brand,
    type:i%3===0?'Solaire':'Optique',buyPrice:180+i*28,sellPrice:350+i*55,createdAt:stamp
  }))
  const contacts = ['Acuvue','Biofinity','Air Optix','Dailies','SofLens','PureVision'].map((brand,i)=>({
    id:uid('con_'),brand,subBrand:'Gamme Démo '+(i+1),ctype:i%2?'Toric':'Spheric',
    material:'Silicone hydrogel',duration:i%2?'Mensuelle':'Journalière',
    buyPrice:90+i*18,sellPrice:160+i*30,createdAt:stamp
  }))
  const lensPricing = ['Essilor','Zeiss','Hoya','Rodenstock','Nikon','Shamir'].map((brand,i)=>({
    id:uid('len_'),brand,vtype:i%2?'Progressif':'Unifocal',material:'Organique',
    index:['1.5','1.6','1.67'][i%3],coating:['Anti-reflet','Anti-rayures','BlueProtect'][i%3],
    buyPrice:150+i*65,sellPrice:320+i*120,createdAt:stamp
  }))
  const dateAgo = n => {
    const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)
  }
  const orders = Array.from({length:22},(_,i)=>{
    const sellPrice=420+(i%8)*165
    const paymentStatus=['Payé','Payé','Acompte','Impayé'][i%4]
    const deposit=paymentStatus==='Payé'?sellPrice:paymentStatus==='Acompte'?Math.round(sellPrice*.4):0
    return {
      id:uid('ord_'),orderNo:'CMD-DEMO-'+String(i+1).padStart(4,'0'),
      clientId:clients[i%clients.length].id,orderDate:dateAgo(2+i*2),
      readyDate:dateAgo(Math.max(0,i*2)),productType:['Monture','Verres','Lentilles','Solaire'][i%4],
      brand:brands[i%brands.length],ref:'OPT-DEMO-'+String(i%10+1).padStart(3,'0'),
      supplierId:suppliers[i%suppliers.length].id,buyPrice:Math.round(sellPrice*.55),
      sellPrice,deposit,rest:sellPrice-deposit,paymentStatus,createdAt:stamp
    }
  })
  const prescriptions = Array.from({length:9},(_,i)=>({
    id:uid('pre_'),clientId:clients[i].id,visitDate:dateAgo(i*4+1),
    odSph:-1-(i%4)*.25,odCyl:-.5,odAxis:90,ogSph:-.75-(i%3)*.25,
    ogCyl:-.25,ogAxis:85,addition:i%3===0?1.5:0,correctionType:i%2?'Près':'Loin',
    notes:'Exemple fictif — démonstration uniquement',createdAt:stamp
  }))
  return {clients,suppliers,frames,contacts,lensPricing,orders,prescriptions,users:[]}
}
