console.log(1);

(function(){
	let materials = [
      'Hydrogen',
      'Helium',
      'Lithium',
      'Berylliums'
    ];

    materials.map((material) => {
      console.log('s'+material.length)
      return material.length;
    }); // [8, 6, 7, 9]
}())
