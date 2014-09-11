/**
********************************************************************************************
* name:     Distance
********************************************************************************************
* desc:   module is responsible for distance metric functionc
********************************************************************************************
* code: written by Gil Tamari, you may not use it without my permission
* date: sep-2012
********************************************************************************************
**/
var Distance = function(){}

Distance.prototype = {
  /************************************************************************
  }
  *   name:  euclidean
  *   desc:  calculating euclid metric between 2 vectors, using Pythagorean formula
  *************************************************************************
  *   in:    v1, v2 - Array[Double], each is an n-vector
  *************************************************************************
  *   out:   distance - Double
  *************************************************************************
  */
  euclidean: function(v1, v2) {
      var total = 0,
          i
      for (i = 0; i < v1.length; i++) {
         total += Math.pow(v2[i] - v1[i], 2)
      }
      return Math.sqrt(total)
   },
  /************************************************************************
  }
  *   name:  manhattan distance
  *   desc:  calculating manhattan distance between 2 vectors, which is the sum of abs delts
  *************************************************************************
  *   in:    v1, v2 - Array[Double], each is an n-vector
  *************************************************************************
  *   out:   distance - Double
  *************************************************************************
  */
   manhattan: function(v1, v2) {
     var total = 0,
         i

     for (i = 0; i < v1.length;  i++) {
        total += Math.abs(v2[i] - v1[i])
     }
     return total
   },
   /************************************************************************
  }
  *   name:  haversine
  *   desc:    Using Haversine distance , the earth, being a "punched" ellipsoid
  *     and not flat, needs a different distance measure. Haversine is an approximation
  *     to a sphere. Google maps uses mercator projection, so it fitts.
  *     we use trigo to compensate for the curvature of the earth
  *     notice we're using 2 dimensional vectors, no n-vectors here
  *************************************************************************
  *   in:    v1, v2 - Array[Double], each is an 2-vector
  *************************************************************************
  *   out:   distance - Double
  *************************************************************************
  */
  haversine: function(point_a,point_b){
    var R     = 6367.5, // the earth's radius
        dLat  = (point_a[0] - point_b[0]) * Math.PI/180,
        dLong = (point_a[1] - point_b[1]) * Math.PI/180,
        lat1  = point_a[0] * Math.PI/180,
        lat2  = point_b[0] * Math.PI/180,
        a     = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLong/2) * Math.sin(dLong/2) * Math.cos(lat1) * Math.cos(lat2),
        c     = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)),
        d     = R*c;
    return d;
  },
  /************************************************************************
  }
  *   name:  max
  *   desc:  returns the biggest manhattan delta between 2 vectors
  *************************************************************************
  *   in:    v1, v2 - Array[Double], each is an n-vector
  *************************************************************************
  *   out:   distance - Double
  *************************************************************************
  */
   max: function(v1, v2) {
     var max = 0,
         i

     for (i = 0; i < v1.length; i++) {
        max = Math.max(max , Math.abs(v2[i] - v1[i]))
     }
     return max
   }
}

if (module && module.exports)
module.exports = Distance