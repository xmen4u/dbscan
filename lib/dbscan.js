/**
********************************************************************************************
* name:     DBScan
********************************************************************************************
* desc:   This module is responsible for Un-supervised clustering algorithm: DBSCAN
*         this algorithm can be impvoed by using spatial indices - i've already used this is R-Tree, Q-tree
*         
********************************************************************************************
* complex (space): O(n^2)
* complex (time):  O(n^2)
********************************************************************************************
* code: written by Gil Tamari, you may not use it without my permission
* date: sep-2012
********************************************************************************************
**/
//



// Constants declarations 
//Node.js / V8 actually supports mozilla's const extension, but unfortunately that cannot be applied to class members, nor is it part of any ECMA standard
var NO_CLUSTER = undefined



function DBScan(distances_instance){
    this.distances = distances_instance
}
 /************************************************************************
}
*   name:  calculateCost
*   desc: 
*   There is a risk to get stuck in a local minima. By local minima i mean the local minima of the cost
*   function:
*   J(x_1,...,x_n, c_1,...c_m, u_1,....u_k) = (1/m) * sum(i=1..m) (X_i - u_[c_i])^2
*   X_i = points
*   c_i = index of centroid in cluster
*   u_i = centroids
*************************************************************************
*   in:    callback function  
*************************************************************************
*   out:   {clusters: Array[Array[Double]], centroids: Array[Double]}
*************************************************************************
*/
DBScan.prototype.calculateCost = function(  closest_centroids_to_points_indices,
                                            centroids,
                                            points){
   var   len = points.length,
         ret_value = 0.0,
         i

   for(i=0; i < len; i++){
      ret_value += 1.0 * Math.abs(this.distances.euclidean(points[i], centroids[closest_centroids_to_points_indices[i]]))
   }
   return ret_value / len

}// calculateCost

/************************************************************************
*   name:  cloneArray
*   desc:  we're cloning the points, to be used in an array we'll delete elements from!
*          this is the fastest way to clone! jspref.com verified
*************************************************************************
*   in:    Array[Double]
*************************************************************************
*   out:   Array[Double]
*************************************************************************
*/
DBScan.prototype.cloneArray = function(in_array){
    var new_array = new Array(in_array.length),
        i

    for(i=0; i < in_array.length; i++){
        new_array[i] = in_array[i]
    }
    return new_array
}// cloneArray


/************************************************************************
*   name:  cluster
*   desc:  using unspervised clustering DBScan algorithm
*************************************************************************
*   in:    points_orig - n-Array[Double] , distance - function
*************************************************************************
*   out:   void
*************************************************************************
*/
DBScan.prototype.cluster = function(   points_orig,
                                       distance
                                    ){

    var all_clusters = [],
        all_centroids = [],
        centroids_old_to_new_mapping = [],
        centroids_indices_by_points = new Array(points_orig.length),
        i = 0,
        j,
        total_distance,
        start_point,
        current_avg,
        distance_to_point,
        new_cluster_index,
        points = new Array(points_orig.length)

    distance = distance || 'euclidean'

    if (typeof distance === 'string') {
        distance = this.distances[distance]
    }

    points = this.cloneArray(points_orig)

    while ((points.length > 0) && (i < points_orig.length)){
        //console.log(points.length)
        start_point = this.cloneArray(points[i])

        // delete DOESN'T keep the index, so if a=[2,3,4]
        //delete a[0] -> a[0] = undefined, a[1] =3, a[2] = 4
        //unlike splice(index,1) which will, so splice(0,1) -> a[0] = 3
        delete points[i]

        for(j=i+1;  j < points_orig.length; j++){

            total_distance = 0

            distance_to_point = distance(start_point, points[j])
            total_distance += distance_to_point

        }
        current_avg = total_distance / j

        for(j = i+1; j < points_orig.length; j++){

            distance_to_point = distance(start_point, points[j])

            // the distance to this poins is LSE to the average!
            // so we add it to the centroid!
            if (distance_to_point <= current_avg){

                // if this point already belongs to a centroid
                // and the distance to the new centroid is smaller OR
                // this point DOESNT belong to a centroid --> add it to the centroid
                if ( ((centroids_indices_by_points[j] !== NO_CLUSTER) &&
                     (distance(points_orig[centroids_indices_by_points[j]], points[j]) >  distance_to_point)) ||
                     (centroids_indices_by_points[j] === NO_CLUSTER)){

                    centroids_indices_by_points[j] = i
                }
            }
        }
        i++
    }

    // we want to find out , how many clusters are there
    // and who they are!
    for(i=0; i < centroids_indices_by_points.length; i++){

        new_cluster_index = all_centroids.indexOf(centroids_indices_by_points[i])

        // if this centroid index DOESN'T exist in the centroid list
        if (new_cluster_index === -1){
            all_centroids.push(points_orig[centroids_indices_by_points[i]])
            all_clusters.push([points_orig[i]])

            centroids_old_to_new_mapping[centroids_indices_by_points[i]] = all_clusters.length -1
        }
        // we insert the point to the cluster it belongs to!
        // which ALREADY exists!
        else{
            all_clusters[centroids_old_to_new_mapping[centroids_indices_by_points[i]]].push(points_orig[i])
        }
    }

    return {clusters: all_clusters, centroids: all_centroids}

}// cluster

//EXPORTS = {dbscan: dbscan, findCentroid: findCentroid}
//module.exports=EXPORTS
module.exports = DBScan