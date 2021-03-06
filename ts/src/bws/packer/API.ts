/// <reference types="tstl" />
/// <reference types="samchon" />

// IMPORTS
try
{
	eval("var std = require('tstl');");
	eval("var samchon = require('samchon');");
}
catch (exception) { }

namespace bws.packer
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export function _Test(): void
	{
		///////////////////////////
		// CONSTRUCT OBJECTS
		///////////////////////////
		let wrapperArray: packer.WrapperArray = new packer.WrapperArray();
		let instanceArray: packer.InstanceArray = new packer.InstanceArray();

		// Wrappers
		wrapperArray.push
		(
			new packer.Wrapper("Large", 1000, 40, 40, 15, 0),
			new packer.Wrapper("Medium", 700, 20, 20, 10, 0),
			new packer.Wrapper("Small", 500, 15, 15, 8, 0)
		);

		///////
		// Each Instance is repeated #15
		///////
		instanceArray.insert(instanceArray.end(), 15, new packer.Product("Eraser", 1, 2, 5));
		instanceArray.insert(instanceArray.end(), 15, new packer.Product("Book", 15, 30, 3));
		instanceArray.insert(instanceArray.end(), 15, new packer.Product("Drink", 3, 3, 10));
		instanceArray.insert(instanceArray.end(), 15, new packer.Product("Umbrella", 5, 5, 20));

		// Wrappers also can be packed into another Wrapper.
		instanceArray.insert(instanceArray.end(), 15, new packer.Wrapper("Notebook-Box", 2000, 30, 40, 4, 2));
		instanceArray.insert(instanceArray.end(), 15, new packer.Wrapper("Tablet-Box", 2500, 20, 28, 2, 0));

		///////////////////////////
		// BEGINS PACKING
		///////////////////////////
		// CONSTRUCT PACKER
		let my_packer: packer.Packer = new packer.Packer(wrapperArray, instanceArray);

		///////
		// PACK (OPTIMIZE)
		let result: packer.WrapperArray = my_packer.optimize();
		///////

		///////////////////////////
		// TRACE PACKING RESULT
		///////////////////////////
		let xml: library.XML = result.toXML();
		console.log(xml.toString());
	}
}

// EXPORTS
try
{
	eval("module.exports = bws.packer");
}
catch (exception) { }