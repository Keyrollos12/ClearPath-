import mongoose from "mongoose";

// كل نشاط داخل اليوم أو إضافي
const customActivitySchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  price: { type: Number, required: true },
  isAdded: { type: Boolean, default: false },  
  isRemoved: { type: Boolean, default: false }  
}, { _id: false });


// كل يوم مخصص في الرحلة
const customDaySchema = new mongoose.Schema({
  day_number: { type: Number, required: true },
  activities: [customActivitySchema],
  isRemoved: { type: Boolean, default: false }  
}, { _id: false });


// الرحلة المخصصة
const customTripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experience: { type: mongoose.Schema.Types.ObjectId, ref: "Experience", required: true },
  base_price: { type: Number, default: 0 },  // سعر الـ Experience الأساسي
  customized_itinerary: [customDaySchema],    // الأيام المعدلة
  added_activities: [customActivitySchema],  // أنشطة إضافية خارج الأيام
  total_price: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// ===== Middleware: حساب السعر الكلي تلقائي بعد أي تعديل =====
customTripSchema.pre("save", function(next) {
  let total = this.base_price || 0;

  this.customized_itinerary.forEach(day => {
    if (!day.isRemoved) {
      day.activities.forEach(act => {
        if (!act.isRemoved) total += act.price;
      });
    }
  });

  this.added_activities.forEach(act => {
    if (!act.isRemoved) total += act.price;
  });

  this.total_price = total;
  next();
});

// ===== Methods: تعديل الأيام والأنشطة بسهولة =====

// إضافة يوم جديد
customTripSchema.methods.addDay = function(dayNumber, activities = []) {
  const exists = this.customized_itinerary.find(d => d.day_number === dayNumber);
  if (!exists) {
    this.customized_itinerary.push({ day_number: dayNumber, activities, isRemoved: false });
  }
};

// إزالة يوم كامل
customTripSchema.methods.removeDay = function(dayNumber) {
  const day = this.customized_itinerary.find(d => d.day_number === dayNumber);
  if (day) day.isRemoved = true;
};

// إضافة نشاط داخل يوم موجود
customTripSchema.methods.addActivityToDay = function(dayNumber, activityObj) {
  const day = this.customized_itinerary.find(d => d.day_number === dayNumber);
  if (day) {
    day.activities.push(activityObj);
  } else {
    // لو اليوم مش موجود، ينشئه مع النشاط
    this.customized_itinerary.push({
      day_number: dayNumber,
      activities: [activityObj],
      isRemoved: false
    });
  }
};

// إزالة نشاط من يوم محدد
customTripSchema.methods.removeActivityFromDay = function(dayNumber, activityId) {
  const day = this.customized_itinerary.find(d => d.day_number === dayNumber);
  if (day) {
    const activity = day.activities.find(a => a.activity.toString() === activityId.toString());
    if (activity) activity.isRemoved = true;
  }
};

// إضافة نشاط خارجي خارج الأيام
customTripSchema.methods.addExtraActivity = function(activityObj) {
  this.added_activities.push(activityObj);
};

// إزالة نشاط خارجي
customTripSchema.methods.removeExtraActivity = function(activityId) {
  const act = this.added_activities.find(a => a.activity.toString() === activityId.toString());
  if (act) act.isRemoved = true;
};

export const CustomTrip = mongoose.model("CustomTrip", customTripSchema);