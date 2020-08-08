const mongoose   = require('mongoose');
const heightChartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    chart: {
        productType: {type: String, required: true},
        size: [{
            region:  {type: String, required: true},
            height: [{type: String, required: true}]
        }]
    }
});

module.exports = mongoose.model('HeightChart', heightChartSchema, 'heightChart');

heightChartSchema.pre('save', function(next) {
    let safe = true;
    if (!this.chart.productType) safe = false;
    for (let i = 0; i < this.chart.size.length; i++) {
        if (!this.chart.size[i].region) safe = false;
        if (this.chart.size[i].height.length <= 1) safe = false;
    }
    if (safe) next();
    else next(new Error('Chart needs a productType & size. Size needs a region and at least one height.'));
});